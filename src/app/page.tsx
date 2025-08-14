import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">α</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">AlphaCode</h1>
            </div>
            <Button variant="outline">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Meet <span className="text-primary">Alpha Mini</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Một AI assistant thông minh, compact và mạnh mẽ được thiết kế để hỗ trợ bạn trong mọi tác vụ hàng ngày. 
            Với khả năng xử lý ngôn ngữ tự nhiên tiên tiến và hiểu biết sâu sắc về ngữ cảnh.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Trải nghiệm ngay
            </Button>
            <Button variant="outline" size="lg">
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-foreground mb-16">Tính năng nổi bật</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-border shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-4">Tốc độ cao</h4>
                <p className="text-muted-foreground">Xử lý và phản hồi cực nhanh, giúp bạn tiết kiệm thời gian và tăng hiệu suất làm việc.</p>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-4">Thông minh</h4>
                <p className="text-muted-foreground">Hiểu ngữ cảnh và ý định của bạn, đưa ra câu trả lời chính xác và hữu ích.</p>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-4">Thân thiện</h4>
                <p className="text-muted-foreground">Giao diện đơn giản, dễ sử dụng và phù hợp với mọi đối tượng người dùng.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">Về Alpha Mini</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Alpha Mini là phiên bản compact của dòng sản phẩm AI Alpha, được tối ưu hóa để mang lại hiệu suất cao 
                trong một package nhỏ gọn. Được phát triển bởi đội ngũ kỹ sư tài năng, Alpha Mini kết hợp công nghệ 
                AI tiên tiến với thiết kế thân thiện với người dùng.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Từ việc trả lời câu hỏi, hỗ trợ viết lách, phân tích dữ liệu đến giải quyết các vấn đề phức tạp, 
                Alpha Mini là người bạn đồng hành đáng tin cậy trong công việc và cuộc sống.
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Khám phá ngay
              </Button>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-primary rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-primary-foreground text-6xl font-bold">α</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">α</span>
            </div>
            <span className="text-xl font-bold text-foreground">Alpha Mini</span>
          </div>
          <p className="text-muted-foreground mb-4">
            © 2025 Alpha Mini. Được phát triển với ❤️ bởi SEP-AlphaCode.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
