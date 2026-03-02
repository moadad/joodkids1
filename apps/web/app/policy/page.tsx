export default function PolicyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-extrabold">سياسة الدفع والاسترجاع</h1>

      <div className="mt-6 rounded-3xl border border-zinc-200 p-6 grid gap-4 text-sm leading-7">
        <div>
          <div className="font-semibold">سياسة الدفع والاسترجاع للمنتج</div>
          <ul className="list-disc pr-5 text-zinc-700 mt-2">
            <li>يمكنك عمل طلب استرجاع او استبدال للمنتجات خلال 7 يوم.</li>
            <li>وفي حالات عيوب الصناعة 10 يوم من وقت وصول الطلب.</li>
          </ul>
        </div>

        <div>
          <div className="font-semibold">شروط إرجاع المنتج</div>
          <p className="text-zinc-700 mt-2">
            عند إرجاع المنتج, تأكد من وجود جميع الملحقات الخاصة بالطلب بحالتها السليمة
            و ان المنتج فى عبوته الاصلية وبتغليفه الاصلي والملابس بحالتها كما وصلت للعميل
            غير مستعملة او ملبوسة او مغسولة.
          </p>
        </div>

        <div>
          <div className="font-semibold">ملاحظات الاستبدال والاسترجاع</div>
          <p className="text-zinc-700 mt-2">
            الاستبدال والاسترجاع علي الملابس الخارجية فقط والتي بدون خصم.
          </p>
        </div>

        <div>
          <div className="font-semibold">طرق الدفع</div>
          <ol className="list-decimal pr-5 text-zinc-700 mt-2">
            <li>نقدا من خلال أحد فروعنا</li>
            <li>تحويلات بنكية</li>
            <li>انستا بي</li>
            <li>محافظ الكترونيه ( فودافون كاش او اتصالات كاش او أورنج كاش)</li>
            <li>نعتذر من عملائنا الكرام البيع بالاجل لاي سبب كان</li>
          </ol>
        </div>

        <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4">
          <div className="font-semibold">تنويه</div>
          <p className="text-zinc-700 mt-2">
            عند رجوع البضاعه بدون تبليغنا قبل الاسترجاع ب 3 ايام على الاقل سوف يتم خصم قيمه الشحن ذهاب و اياب من العربون المدفوع لدينا.
          </p>
        </div>

        <div>
          <p className="text-zinc-700">
            لديك 7 يوم من تاريخ إستلامك أي سلعة لتقدم طلب ارجاعها.
          </p>
        </div>
      </div>
    </div>
  );
}
