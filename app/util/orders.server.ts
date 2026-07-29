import { createServerFn } from '@tanstack/start';
import { supabaseAdmin } from './supabase.server';
import { z } from 'zod';

const checkoutSchema = z.object({
  userId: z.string().optional(),
  customerName: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(10, 'رقم الهاتف مطلوب'),
  address: z.string().min(5, 'العنوان بالتفصيل مطلوب'),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      priceUsd: z.number(),
      priceIqd: z.number(),
    })
  ),
  totalUsd: z.number(),
  totalIqd: z.number(),
});

export const createOrder = createServerFn({ method: 'POST' })
  .validator((data: any) => checkoutSchema.parse(data))
  .handler(async ({ data }) => {
    // 1. حفظ الطلب في جدول orders
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: data.userId || null,
        total_usd: data.totalUsd,
        total_iqd: data.totalIqd,
        shipping_address: data.address,
        contact_phone: data.phone,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error('فشل في إنشاء الطلب');
    }

    // 2. حفظ عناصر الطلب مع تجميد السعر (Snapshot) في order_items
    const orderItemsToInsert = data.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      locked_price_usd: item.priceUsd,
      locked_price_iqd: item.priceIqd,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) {
      throw new Error('فشل في حفظ تفاصيل القطع');
    }

    // 3. إرسال إشعار فوري إلى تليغرام الإدارة
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (botToken && adminChatId) {
      const message = `
🔔 **طلب جديد من متجر كليوباترا**
━━━━━━━━━━━━━━━━━━
🧾 رقم الطلب: #${order.id.slice(0, 8)}
👤 الاسم: ${data.customerName}
📞 الهاتف: ${data.phone}
📍 العنوان: ${data.address}

💰 الإجمالي بالدولار: $${data.totalUsd.toLocaleString()}
💵 الإجمالي بالدينار: ${data.totalIqd.toLocaleString()} د.ع
      `;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: adminChatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
    }

    return { success: true, orderId: order.id };
  });
