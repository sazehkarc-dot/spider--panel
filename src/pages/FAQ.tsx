import { useState } from 'react'

const faqs = [
  { q: 'چگونه سفارش خود را ثبت کنم؟', a: 'محصول مورد نظر را به سبد خرید اضافه کنید، به صفحه تسویه حساب بروید و اطلاعات خود را وارد کنید. پس از ثبت سفارش، همکاران ما با شما تماس خواهند گرفت.' },
  { q: 'هزینه ارسال چقدر است؟', a: 'هزینه ارسال بسته به شهر شما متفاوت است. برای سفارش‌های بالای ۵۰۰,۰۰۰ تومان ارسال رایگان است.' },
  { q: 'چند روز طول می‌کشد تا سفارشم برسد؟', a: 'در تهران ۱ تا ۲ روز کاری و در سایر شهرها ۲ تا ۵ روز کاری.' },
  { q: 'آیا می‌توانم سفارشم را کنسل کنم؟', a: 'بله، تا زمانی که سفارش ارسال نشده باشد می‌توانید آن را کنسل کنید. برای این کار با پشتیبانی تماس بگیرید.' },
  { q: 'کیفیت محصولات چگونه است؟', a: 'تمام محصولات با بالاترین کیفیت انتخاب و بررسی شده‌اند. ما فقط محصولاتی را ارائه می‌دهیم که خودمان هم استفاده کنیم.' },
  { q: 'آیا بسته‌بندی هدیه دارید؟', a: 'بله، تمام سفارش‌ها با بسته‌بندی زیبا و با عشق ارسال می‌شوند. 🎀' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">سوالات متداول</h1>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="card overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-4 text-right">
              <span className="font-medium text-sm sm:text-base">{faq.q}</span>
              <span className="text-beesa-pink text-xl shrink-0 mr-2">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <div className="px-4 pb-4 text-gray-600 text-sm leading-7">{faq.a}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
