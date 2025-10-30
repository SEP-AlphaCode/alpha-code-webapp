"use client";

import React, { useState, useMemo } from "react";
import { useSubscription } from "@/features/subscription/hooks/use-subscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";

// Kiểu dữ liệu cơ bản API
interface SubscriptionPlan {
  id: string;
  name: string;
  description: string; // HTML
  price: number;
  billingCycle: number; // 1,3,9,12
  status: number;
  // statusText: string;
  createdDate: string;
  lastUpdated: string;
  // Optional để UI
  isRecommended?: boolean;  
  isCurrent?: boolean;
  buttonText?: string;
  badge?: string;
  note?: string;
}

export default function SubscriptionPlansPage() {
  const [page] = useState(1);
  const [limit] = useState(10);
  const [billingType, setBillingType] = useState<"Personal" | "Business">("Personal");

  const { useGetPagedSubscriptions } = useSubscription();
  const { data, isLoading, isError } = useGetPagedSubscriptions(page, limit);

  // Map API data để gán các thuộc tính UI (isCurrent, badge, buttonText...)
  const plans: SubscriptionPlan[] = useMemo(() => {
    if (!data?.data) return [];

    return data.data
      .map((plan: SubscriptionPlan) => {
        let isRecommended = false;
        let isCurrent = false;
        let buttonText = "Đăng ký ngay";
        let badge;
        let note;

        if (plan.name.includes("1 năm") || plan.billingCycle === 12) {
          isRecommended = true;
          buttonText = "Get Pro";
          note = "Unlimited subject to abuse guardrail. **Learn more**";
        } else if (plan.billingCycle === 1) {
          isCurrent = true;
          buttonText = "Your current plan";
        } else if (plan.billingCycle === 9) {
          badge = "NEW";
          note = "Limits apply";
        } else {
          note = "Limits apply";
        }

        return { ...plan, isRecommended, isCurrent, buttonText, badge, note };
      })
      .sort((a, b) => a.billingCycle - b.billingCycle);
  }, [data?.data]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(price);
  };

  const getButtonClass = (plan: SubscriptionPlan) => {
    if (plan.isCurrent) return "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700";
    if (plan.badge === "NEW") return "bg-indigo-600 text-white hover:bg-indigo-700";
    return "bg-white text-black hover:bg-gray-200";
  };

  const getBillingCycleText = (cycle: number) => {
    if (cycle === 1) return "/ month";
    if (cycle === 3) return "/ 3 months";
    if (cycle === 9) return "/ 9 months";
    if (cycle === 12) return "/ year";
    return "/ cycle";
  };

  // Parse description HTML thành feature list
  const parseFeaturesFromDescription = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return Array.from(doc.querySelectorAll("p")).map(p => {
      const text = p.textContent || "";
      return {
        name: text.replace(/[✅❌]/g, "").trim(),
        available: text.includes("✅"),
      };
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header và Chuyển đổi Personal/Business */}
      <section className="text-center py-10 pt-16">
        <h1 className="text-4xl font-semibold mb-8 tracking-tight">Upgrade your plan</h1>
        <div className="flex justify-center mb-12">
          <div className="p-1 bg-gray-900 rounded-full flex space-x-1 text-sm font-medium">
            <button
              onClick={() => setBillingType("Personal")}
              className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                billingType === "Personal"
                  ? "bg-gray-700 text-white shadow-lg"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => setBillingType("Business")}
              className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                billingType === "Business"
                  ? "bg-gray-700 text-white shadow-lg"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              Business
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards Container */}
      <section className="max-w-7xl mx-auto px-4 pb-16 grid gap-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
        {isLoading && (
          <div className="col-span-4 flex justify-center py-20">
            <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
          </div>
        )}

        {isError && (
          <div className="col-span-4 text-center text-red-500">
            Không tải được danh sách gói đăng ký.
          </div>
        )}

        {!isLoading &&
          plans.length > 0 &&
          plans.map(plan => (
            <Card
              key={plan.id}
              className={`bg-gray-900 text-white rounded-xl border border-gray-800 shadow-xl overflow-hidden flex flex-col ${
                plan.badge === "NEW" ? "bg-indigo-900/50 border-indigo-700" : ""
              }`}
            >
              <CardHeader className="p-6 pb-4 relative">
                {plan.badge && (
                  <div className="absolute top-0 right-0 mt-4 mr-4">
                    <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>

                {/* Giá */}
                <div className="mt-2 flex items-baseline">
                  {plan.price === 0 ? (
                    <span className="text-5xl font-extrabold">0</span>
                  ) : (
                    <span className="text-5xl font-extrabold">{formatPrice(plan.price)}</span>
                  )}
                  <span className="ml-1 text-lg font-semibold text-gray-400">VNĐ</span>
                  {plan.price > 0 && (
                    <span className="text-sm ml-1 text-gray-400">
                      {getBillingCycleText(plan.billingCycle)} (inclusive of VAT)
                    </span>
                  )}
                </div>
              </CardHeader>

              {/* Nút chính */}
              <div className="px-6 pb-6">
                <Button
                  size="lg"
                  className={`w-full font-semibold text-base py-6 rounded-lg transition-colors ${getButtonClass(
                    plan
                  )}`}
                  disabled={plan.isCurrent}
                >
                  {plan.buttonText}
                </Button>
              </div>

              {/* Features từ description */}
              <CardContent className="p-6 pt-0 flex-grow">
                <h3 className="text-lg font-semibold mb-4 border-t border-gray-800 pt-4">
                  {plan.isCurrent
                    ? "Limited access to core features"
                    : "Full access to core features"}
                </h3>

                <ul className="space-y-3 text-sm text-gray-300">
                  {parseFeaturesFromDescription(plan.description).map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.available ? (
                        <Check className="text-green-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="text-gray-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`${
                          !feature.available ? "text-gray-500" : "text-white"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              {/* Ghi chú */}
              {plan.note && (
                <div className="p-6 pt-4 border-t border-gray-800">
                  <p
                    className="text-xs text-gray-500"
                    dangerouslySetInnerHTML={{
                      __html: plan.note.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                    }}
                  />
                </div>
              )}
            </Card>
          ))}
      </section>

      {/* Liên kết Doanh nghiệp */}
      <div className="text-center pb-10">
        <p className="text-sm text-gray-400">Need more capabilities for your business?</p>
        <a
          href="#"
          className="text-indigo-400 hover:text-indigo-300 font-medium text-sm mt-1 inline-block"
        >
          See ChatGPT Enterprise
        </a>
      </div>
    </div>
  );
}
