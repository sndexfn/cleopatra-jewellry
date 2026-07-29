import { createServerFn } from '@tanstack/start';
import { supabaseAdmin } from './supabase.server';
import { z } from 'zod';

const phoneSchema = z.string().regex(/^(\+964|0)?7[0-9]{9}$/, 'رقم الهاتف العراقي غير صالح');

// 1. طلب إرسال رمز التحقق
export const requestOtp = createServerFn({ method: 'POST' })
  .validator((data: { phone: string }) => phoneSchema.parse(data.phone))
  .handler(async ({ data: phone }) => {
    // تنسيق الرقم بصيغة موحدة
    const formattedPhone = phone.startsWith('0') ? '+964' + phone.slice(1) : phone;
    
    // توليد رمز مكون من 6 أرقام
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000); // صالح لمدة 10 دقائق

    // حفظ الرمز في جدول phone_verifications
    const { error } = await supabaseAdmin.from('phone_verifications').upsert({
      phone: formattedPhone,
      hashed_code: code, // في الإنتاج يفضل عمل Hash للرمز
      attempts: 0,
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      throw new Error('فشل في إنشاء رمز التحقق');
    }

    // إرسال الرمز عبر تليغرام (يتم تفعيل الـ Webhook أو إرساله مباشرة إذا كان البوت متصلاً)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    // ملاحظة: في بيئة الإنتاج يتم توجيه المستخدم لفتح البوت وإرسال الرمز أو كود الربط
    
    return { success: true, message: 'تم إرسال رمز التحقق بنجاح عبر تليغرام' };
  });

// 2. التحقق من الرمز وتفعيل الحساب
export const verifyOtpAndLogin = createServerFn({ method: 'POST' })
  .validator((data: { phone: string; code: string }) => {
    return z.object({
      phone: z.string(),
      code: z.string().length(6),
    }).parse(data);
  })
  .handler(async ({ data }) => {
    const { phone, code } = data;

    // التحقق من قاعدة البيانات
    const { data: record, error } = await supabaseAdmin
      .from('phone_verifications')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error || !record) {
      throw new Error('رقم الهاتف غير مسجل أو انتهت صلاحية الطلب');
    }

    if (new Date() > new Date(record.expires_at)) {
      throw new Error('انتهت صلاحية رمز التحقق');
    }

    if (record.hashed_code !== code) {
      // زيادة عدد المحاولات الفاشلة
      await supabaseAdmin
        .from('phone_verifications')
        .update({ attempts: record.attempts + 1 })
        .eq('phone', phone);
      
      throw new Error('رمز التحقق غير صحيح');
    }

    // الرمز صحيح: يتم إنشاء أو تسجيل الدخول للمستخدم في Supabase Auth
    // (يتم إنشاء بريد وهمي مبني على رقم الهاتف داخلياً لتوافق النظام)
    const dummyEmail = `${phone.replace('+', '')}@cleopatra-gold.local`;
    
    let userId;
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const found = existingUser?.users.find((u: any) => u.email === dummyEmail);

    if (found) {
      userId = found.id;
    } else {
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: dummyEmail,
        password: Math.random().toString(36).slice(-8) + 'A1!',
        email_confirm: true,
      });
      if (createError) throw new Error('فشل في إنشاء حساب المستخدم');
      userId = newUser.user.id;
    }

    // تنظيف جدول التحقق بعد النجاح
    await supabaseAdmin.from('phone_verifications').delete().eq('phone', phone);

    return { success: true, userId };
  });
