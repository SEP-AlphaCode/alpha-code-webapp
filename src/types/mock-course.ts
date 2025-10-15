import { Category, Course } from "./courses";

export const categories: Category[] = [
  {
    id: "1",
    name: "Nguyên lý Cơ bản về Robotics",
    description: "Các nguyên tắc và khái niệm cơ bản của robotics bao gồm cơ khí, điện tử và lập trình",
    slug: "robotics-fundamentals",
    imageUrl: "/images/categories/robotics-fundamentals.jpg",
    status: 1,
    createdDate: "2024-01-15"
  },
  {
    id: "2",
    name: "Lập trình Robot",
    description: "Ngôn ngữ lập trình và kỹ thuật điều khiển robot và hệ thống tự động hóa",
    slug: "robot-programming",
    imageUrl: "/images/categories/robot-programming.jpg",
    status: 1,
    createdDate: "2024-01-20"
  },
  {
    id: "3",
    name: "Robotics Công nghiệp",
    description: "Hệ thống tự động hóa và robotics cho sản xuất, dây chuyền lắp ráp và ứng dụng công nghiệp",
    slug: "industrial-robotics",
    imageUrl: "/images/categories/industrial-robotics.jpg",
    status: 1,
    createdDate: "2024-02-05"
  },
  {
    id: "4",
    name: "Hệ thống Tự động",
    description: "Robot tự hành, drone và phương tiện tự hành với tích hợp AI và cảm biến",
    slug: "autonomous-systems",
    imageUrl: "/images/categories/autonomous-systems.jpg",
    status: 1,
    createdDate: "2024-02-12"
  },
  {
    id: "5",
    name: "Thị giác máy & Cảm biến Robot",
    description: "Thị giác máy tính, LiDAR, cảm biến siêu âm và hệ thống nhận thức cho robot",
    slug: "robot-vision-sensors",
    imageUrl: "/images/categories/robot-vision.jpg",
    status: 1,
    createdDate: "2024-02-18"
  },
  {
    id: "6",
    name: "Điều khiển Cánh tay Robot",
    description: "Động học, động lực học và điều khiển chính xác các bộ phận cánh tay robot",
    slug: "robotic-arm-control",
    imageUrl: "/images/categories/robotic-arm.jpg",
    status: 1,
    createdDate: "2024-03-01"
  },
  {
    id: "7",
    name: "Robotics Bầy đàn",
    description: "Điều khiển phối hợp nhiều robot làm việc cùng nhau như một hệ thống bầy đàn",
    slug: "swarm-robotics",
    imageUrl: "/images/categories/swarm-robotics.jpg",
    status: 1,
    createdDate: "2024-03-10"
  },
  {
    id: "8",
    name: "Tương tác Người-Máy",
    description: "Thiết kế robot có thể tương tác an toàn và hiệu quả với con người",
    slug: "human-robot-interaction",
    imageUrl: "/images/categories/human-robot-interaction.jpg",
    status: 1,
    createdDate: "2024-03-15"
  },
  {
    id: "9",
    name: "Robotics Di động",
    description: "Định vị, lập kế hoạch đường đi và điều khiển robot di động có bánh và chân",
    slug: "mobile-robotics",
    imageUrl: "/images/categories/mobile-robotics.jpg",
    status: 1,
    createdDate: "2024-03-22"
  },
  {
    id: "10",
    name: "Mô phỏng Robot",
    description: "Môi trường ảo và công cụ mô phỏng và kiểm tra hệ thống robot",
    slug: "robotic-simulation",
    imageUrl: "/images/categories/robotic-simulation.jpg",
    status: 1,
    createdDate: "2024-03-30"
  }
];

export const courses: Course[] = [
  {
    id: "rf-1",
    name: "Giới thiệu về Robotics",
    description: "Tìm hiểu các khái niệm cơ bản và lịch sử của robotics",
    price: 89.99,
    requireLicense: false,
    level: 1,
    totalLessons: 12,
    status: 1,
    createdDate: "2024-01-20",
    totalDuration: 360,
    categoryId: "1",
    slug: "introduction-to-robotics",
    imageUrl: "/images/courses/robotics-intro.jpg",
    lessons: [
      {
        id: "l-rf1-1", courseId: "rf-1", title: "Robotics là gì?",
        contentUrl: "/content/rf1/lesson1.mp4", requireRobot: false,
        duration: 1200, content: "Giới thiệu về các khái niệm robotics",
        contentType: "video", orderNumber: 1, solution: null
      },
      {
        id: "l-rf1-2", courseId: "rf-1", title: "Lịch sử Robotics",
        contentUrl: "/content/rf1/lesson2.mp4", requireRobot: false,
        duration: 1800, content: "Sự phát triển lịch sử của robot",
        contentType: "video", orderNumber: 2, solution: null
      },
      {
        id: "l-rf1-3", courseId: "rf-1", title: "Các loại Robot",
        contentUrl: "/content/rf1/lesson3.mp4", requireRobot: false,
        duration: 1500, content: "Các danh mục robot khác nhau",
        contentType: "video", orderNumber: 3, solution: null
      },
      {
        id: "l-rf1-4", courseId: "rf-1", title: "Thành phần Cơ bản của Robot",
        requireRobot: false,
        duration: 2400, content: "Cảm biến, cơ cấu chấp hành, bộ điều khiển",
        contentType: "text", orderNumber: 4, solution: null
      },
      {
        id: "l-rf1-5", courseId: "rf-1", title: "Ứng dụng của Robot",
        contentUrl: "/content/rf1/lesson5.mp4", requireRobot: false,
        duration: 2100, content: "Ứng dụng trong thế giới thực",
        contentType: "video", orderNumber: 5, solution: null
      },
      {
        id: "l-rf1-6", courseId: "rf-1", title: "Nguyên tắc An toàn Cơ bản",
        requireRobot: false,
        duration: 1800, content: "Giao thức và thực hành an toàn",
        contentType: "text", orderNumber: 6, solution: null
      },
      {
        id: "l-rf1-7", courseId: "rf-1", title: "Lập trình Cơ bản",
        contentUrl: "/content/rf1/lesson7.mp4", requireRobot: true,
        duration: 2700, content: "Giới thiệu về lập trình robot",
        contentType: "video", orderNumber: 7, solution: { exercise: "simple_movement" }
      },
      {
        id: "l-rf1-8", courseId: "rf-1", title: "Bài tập Robot Đầu tiên",
        requireRobot: true,
        duration: 3600, content: "Điều khiển robot thực hành",
        contentType: "programming", orderNumber: 8,
        solution: { code: "robot.move_forward(100)", explanation: "Lệnh di chuyển cơ bản" }
      },
      {
        id: "l-rf1-9", courseId: "rf-1", title: "Xử lý Sự cố Cơ bản",
        contentUrl: "/content/rf1/lesson9.mp4", requireRobot: false,
        duration: 1500, content: "Các vấn đề thường gặp và giải pháp",
        contentType: "video", orderNumber: 9, solution: null
      },
      {
        id: "l-rf1-10", courseId: "rf-1", title: "Xu hướng Ngành",
        requireRobot: false,
        duration: 2100, content: "Xu hướng robotics hiện tại",
        contentType: "text", orderNumber: 10, solution: null
      },
      {
        id: "l-rf1-11", courseId: "rf-1", title: "Thiết lập Dự án Cuối khóa",
        requireRobot: true,
        duration: 3000, content: "Chuẩn bị cho dự án cuối khóa",
        contentType: "programming", orderNumber: 11,
        solution: { requirements: ["cảm biến", "di chuyển", "logic"] }
      },
      {
        id: "l-rf1-12", courseId: "rf-1", title: "Ôn tập Khóa học",
        contentUrl: "/content/rf1/lesson12.mp4", requireRobot: false,
        duration: 1200, content: "Tóm tắt các khái niệm chính",
        contentType: "video", orderNumber: 12, solution: null
      }
    ]
  },
  {
    id: "rf-2", name: "Toán học cho Robotics", description: "Toán học thiết yếu cho robotics bao gồm đại số tuyến tính và giải tích", price: 129.99, requireLicense: false, level: 2, totalLessons: 18, status: 1, createdDate: "2024-01-25", totalDuration: 540, categoryId: "1", slug: "robotics-mathematics"
  },
  {
    id: "rf-3", name: "Điện tử cho Robotics", description: "Thiết kế mạch, cảm biến và linh kiện điện tử", price: 149.99, requireLicense: false, level: 2, totalLessons: 15, status: 1, createdDate: "2024-02-01", totalDuration: 450, categoryId: "1", slug: "electronics-for-robotics"
  },
  {
    id: "rf-4", name: "Nguyên lý Thiết kế Cơ khí", description: "Mô hình CAD và nguyên lý cơ khí cho robot", price: 119.99, requireLicense: true, level: 2, totalLessons: 14, status: 1, createdDate: "2024-02-10", totalDuration: 420, categoryId: "1", slug: "mechanical-design-basics"
  },
  {
    id: "rf-5", name: "Tiêu chuẩn An toàn Robotics", description: "Giao thức an toàn ngành và thực hành tốt nhất", price: 79.99, requireLicense: true, level: 1, totalLessons: 8, status: 1, createdDate: "2024-02-15", totalDuration: 240, categoryId: "1", slug: "robotics-safety-standards"
  }, {
    id: "rp-1", 
    name: "Python cho Robotics", 
    description: "Làm chủ lập trình Python đặc biệt cho ứng dụng robotics", 
    price: 159.99, 
    requireLicense: false, 
    level: 2, 
    totalLessons: 20, 
    status: 1, 
    createdDate: "2024-01-22", 
    totalDuration: 600, 
    categoryId: "2", 
    slug: "python-for-robotics", 
    imageUrl: "/images/courses/python-robotics.jpg",
    lessons: [
      {
        id: "l-rp1-1", courseId: "rp-1", title: "Thiết lập Python cho Robotics", 
        contentUrl: "/content/rp1/lesson1.mp4", requireRobot: false, 
        duration: 1800, content: "Cài đặt Python và thư viện robotics", 
        contentType: "video", orderNumber: 1, solution: null
      },
      {
        id: "l-rp1-2", courseId: "rp-1", title: "Cú pháp Python Cơ bản", 
        requireRobot: false, 
        duration: 2400, content: "Biến, vòng lặp, hàm", 
        contentType: "text", orderNumber: 2, solution: null
      },
      {
        id: "l-rp1-3", courseId: "rp-1", title: "Điều khiển Robot bằng Python", 
        contentUrl: "/content/rp1/lesson3.mp4", requireRobot: true, 
        duration: 2700, content: "Điều khiển chuyển động robot", 
        contentType: "video", orderNumber: 3, 
        solution: {code: "import robot\nrobot.forward()"}
      },
      {
        id: "l-rp1-4", courseId: "rp-1", title: "Xử lý Dữ liệu Cảm biến", 
        requireRobot: true, 
        duration: 3000, content: "Đọc và xử lý dữ liệu cảm biến", 
        contentType: "programming", orderNumber: 4, 
        solution: {code: "sensor_data = robot.read_sensor()"}
      },
      {
        id: "l-rp1-5", courseId: "rp-1", title: "Lập trình Hướng đối tượng", 
        contentUrl: "/content/rp1/lesson5.mp4", requireRobot: false, 
        duration: 3600, content: "Lớp và đối tượng cho robot", 
        contentType: "video", orderNumber: 5, solution: null
      },
      {
        id: "l-rp1-6", courseId: "rp-1", title: "Triển khai Lớp Robot", 
        requireRobot: true, 
        duration: 4200, content: "Tạo lớp Robot", 
        contentType: "programming", orderNumber: 6, 
        solution: {code: "class Robot:\n    def __init__(self):\n        self.position = 0"}
      },
      {
        id: "l-rp1-7", courseId: "rp-1", title: "Xử lý Lỗi", 
        requireRobot: false, 
        duration: 2100, content: "Khối try-except cho robotics", 
        contentType: "text", orderNumber: 7, solution: null
      },
      {
        id: "l-rp1-8", courseId: "rp-1", title: "Đa luồng cho Robot", 
        contentUrl: "/content/rp1/lesson8.mp4", requireRobot: true, 
        duration: 4800, content: "Các hoạt động robot đồng thời", 
        contentType: "video", orderNumber: 8, 
        solution: {code: "import threading\nthread = threading.Thread(target=robot_task)"}
      },
      {
        id: "l-rp1-9", courseId: "rp-1", title: "Tích hợp API", 
        requireRobot: false, 
        duration: 3300, content: "Kết nối với API robot", 
        contentType: "programming", orderNumber: 9, 
        solution: {code: "import requests\nresponse = requests.get('api/robot/status')"}
      },
      {
        id: "l-rp1-10", courseId: "rp-1", title: "Trực quan hóa Dữ liệu", 
        contentUrl: "/content/rp1/lesson10.mp4", requireRobot: false, 
        duration: 2700, content: "Vẽ biểu đồ dữ liệu cảm biến robot", 
        contentType: "video", orderNumber: 10, solution: null
      },
      {
        id: "l-rp1-11", courseId: "rp-1", title: "Thuật toán Nâng cao", 
        requireRobot: true, 
        duration: 5400, content: "Thuật toán lập kế hoạch đường đi", 
        contentType: "programming", orderNumber: 11, 
        solution: {algorithm: "A*", implementation: "path_finding.py"}
      },
      {
        id: "l-rp1-12", courseId: "rp-1", title: "Kiểm thử Mã Robot", 
        requireRobot: false, 
        duration: 2400, content: "Kiểm thử đơn vị cho robotics", 
        contentType: "text", orderNumber: 12, solution: null
      },
      {
        id: "l-rp1-13", courseId: "rp-1", title: "Tối ưu hóa Hiệu suất", 
        contentUrl: "/content/rp1/lesson13.mp4", requireRobot: true, 
        duration: 3600, content: "Tối ưu hóa hiệu suất mã robot", 
        contentType: "video", orderNumber: 13, 
        solution: {techniques: ["bộ nhớ đệm", "bất đồng bộ", "thuật toán tối ưu"]}
      },
      {
        id: "l-rp1-14", courseId: "rp-1", title: "Dự án Cuối: Robot Tự hành", 
        requireRobot: true, 
        duration: 7200, content: "Xây dựng hệ thống robot tự hành", 
        contentType: "programming", orderNumber: 14, 
        solution: {project: "định_vị_tự_hành", requirements: ["cảm biến", "lập bản đồ", "điều khiển"]}
      }
    ]
  },
  {
    id: "rp-2", name: "Nguyên lý ROS (Hệ điều hành Robot)", description: "Hướng dẫn hoàn chỉnh về ROS cho phát triển phần mềm robot", price: 199.99, requireLicense: false, level: 3, totalLessons: 25, status: 1, createdDate: "2024-01-30", totalDuration: 750, categoryId: "2", slug: "ros-fundamentals"
  },
  {
    id: "rp-3", name: "C++ cho Robotics Nhúng", description: "Lập trình hiệu năng cao cho hệ thống robot thời gian thực", price: 179.99, requireLicense: false, level: 3, totalLessons: 22, status: 1, createdDate: "2024-02-05", totalDuration: 660, categoryId: "2", slug: "cpp-embedded-robotics"
  },
  {
    id: "rp-4", name: "MATLAB cho Điều khiển Robotics", description: "Phát triển thuật toán và mô phỏng sử dụng MATLAB", price: 149.99, requireLicense: true, level: 2, totalLessons: 16, status: 1, createdDate: "2024-02-12", totalDuration: 480, categoryId: "2", slug: "matlab-robotics-control"
  },
  {
    id: "rp-5", name: "Lập trình Robot Thời gian Thực", description: "Hệ thống thời gian thực cứng và điều khiển xác định", price: 219.99, requireLicense: false, level: 4, totalLessons: 18, status: 1, createdDate: "2024-02-20", totalDuration: 540, categoryId: "2", slug: "real-time-robot-programming"
  },
  {
    id: "ir-1", 
    name: "Lập trình Robot Công nghiệp", 
    description: "Lập trình robot công nghiệp FANUC, KUKA và ABB", 
    price: 299.99, 
    requireLicense: true, 
    level: 3, 
    totalLessons: 24, 
    status: 1, 
    createdDate: "2024-02-01", 
    totalDuration: 720, 
    categoryId: "3", 
    slug: "industrial-robot-programming", 
    imageUrl: "/images/courses/industrial-robotics.jpg",
    lessons: [
      {
        id: "l-ir1-1", courseId: "ir-1", title: "Tiêu chuẩn An toàn Công nghiệp", 
        contentUrl: "/content/ir1/lesson1.mp4", requireRobot: false, 
        duration: 3600, content: "Giao thức an toàn cho robot công nghiệp", 
        contentType: "video", orderNumber: 1, solution: null
      },
      {
        id: "l-ir1-2", courseId: "ir-1", title: "Giao diện Robot FANUC", 
        requireRobot: true, 
        duration: 4200, content: "Lập trình bộ điều khiển FANUC", 
        contentType: "programming", orderNumber: 2, 
        solution: {interface: "TP", commands: ["J", "L", "C"]}
      },
      {
        id: "l-ir1-3", courseId: "ir-1", title: "Tổng quan Hệ thống KUKA", 
        contentUrl: "/content/ir1/lesson3.mp4", requireRobot: true, 
        duration: 4800, content: "Lập trình robot KUKA", 
        contentType: "video", orderNumber: 3, 
        solution: {system: "KRC4", language: "KRL"}
      },
      {
        id: "l-ir1-4", courseId: "ir-1", title: "ABB RobotStudio", 
        requireRobot: true, 
        duration: 5400, content: "Môi trường lập trình ABB", 
        contentType: "programming", orderNumber: 4, 
        solution: {software: "RobotStudio", features: ["mô phỏng", "lập trình ngoại tuyến"]}
      },
      {
        id: "l-ir1-5", courseId: "ir-1", title: "Lập kế hoạch Đường đi", 
        contentUrl: "/content/ir1/lesson5.mp4", requireRobot: true, 
        duration: 6000, content: "Lập kế hoạch đường đi robot công nghiệp", 
        contentType: "video", orderNumber: 5, 
        solution: {algorithms: ["tuyến tính", "tròn", "spline"]}
      },
      {
        id: "l-ir1-6", courseId: "ir-1", title: "Tính toán Tải trọng", 
        requireRobot: false, 
        duration: 3000, content: "Tính toán khả năng tải robot", 
        contentType: "text", orderNumber: 6, solution: null
      },
      {
        id: "l-ir1-7", courseId: "ir-1", title: "Thiết lập Điểm Tâm Công cụ", 
        contentUrl: "/content/ir1/lesson7.mp4", requireRobot: true, 
        duration: 4800, content: "Cấu hình và hiệu chuẩn TCP", 
        contentType: "video", orderNumber: 7, 
        solution: {calibration: "4 điểm", accuracy: "0.1mm"}
      },
      {
        id: "l-ir1-8", courseId: "ir-1", title: "Tích hợp I/O", 
        requireRobot: true, 
        duration: 4200, content: "Tích hợp PLC và cảm biến", 
        contentType: "programming", orderNumber: 8, 
        solution: {protocols: ["Profibus", "Ethernet/IP", "DeviceNet"]}
      },
      {
        id: "l-ir1-9", courseId: "ir-1", title: "Xử lý Lỗi", 
        contentUrl: "/content/ir1/lesson9.mp4", requireRobot: true, 
        duration: 3600, content: "Khôi phục lỗi robot công nghiệp", 
        contentType: "video", orderNumber: 9, 
        solution: {errors: ["va chạm", "quá hành trình", "truyền thông"]}
      },
      {
        id: "l-ir1-10", courseId: "ir-1", title: "Quy trình Bảo trì", 
        requireRobot: false, 
        duration: 2400, content: "Bảo trì phòng ngừa", 
        contentType: "text", orderNumber: 10, solution: null
      },
      {
        id: "l-ir1-11", courseId: "ir-1", title: "Lập trình Nâng cao", 
        contentUrl: "/content/ir1/lesson11.mp4", requireRobot: true, 
        duration: 6600, content: "Ứng dụng công nghiệp phức tạp", 
        contentType: "video", orderNumber: 11, 
        solution: {applications: ["hàn", "sơn", "lắp ráp"]}
      },
      {
        id: "l-ir1-12", courseId: "ir-1", title: "Kiểm soát Chất lượng", 
        requireRobot: true, 
        duration: 4200, content: "Đảm bảo chất lượng trong tự động hóa", 
        contentType: "programming", orderNumber: 12, 
        solution: {metrics: ["khả năng lặp lại", "độ chính xác", "thời gian chu kỳ"]}
      }
    ]
  },
  {
    id: "ir-2", name: "Hệ thống Sản xuất Tự động", description: "Thiết kế và triển khai giải pháp tự động hóa hoàn chỉnh", price: 349.99, requireLicense: true, level: 4, totalLessons: 28, status: 1, createdDate: "2024-02-08", totalDuration: 840, categoryId: "3", slug: "automated-manufacturing-systems"
  },
  {
    id: "ir-3", name: "Tích hợp PLC với Robotics", description: "Kết nối robot với bộ điều khiển logic khả trình", price: 279.99, requireLicense: true, level: 3, totalLessons: 20, status: 1, createdDate: "2024-02-15", totalDuration: 600, categoryId: "3", slug: "plc-robotics-integration"
  },
  {
    id: "as-1", 
    name: "Thuật toán Định vị Tự hành", 
    description: "Lập kế hoạch đường đi và tránh chướng ngại vật cho hệ thống tự lái", 
    price: 249.99, 
    requireLicense: false, 
    level: 4, 
    totalLessons: 22, 
    status: 1, 
    createdDate: "2024-02-05", 
    totalDuration: 660, 
    categoryId: "4", 
    slug: "autonomous-navigation-algorithms", 
    imageUrl: "/images/courses/autonomous-navigation.jpg",
    lessons: [
      {
        id: "l-as1-1", courseId: "as-1", title: "Giới thiệu Hệ thống Tự hành", 
        contentUrl: "/content/as1/lesson1.mp4", requireRobot: false, 
        duration: 2400, content: "Tổng quan về định vị tự hành", 
        contentType: "video", orderNumber: 1, solution: null
      },
      {
        id: "l-as1-2", courseId: "as-1", title: "Hợp nhất Cảm biến", 
        requireRobot: true, 
        duration: 4800, content: "Kết hợp dữ liệu cảm biến", 
        contentType: "programming", orderNumber: 2, 
        solution: {sensors: ["LiDAR", "camera", "IMU"], fusion: "Bộ lọc Kalman"}
      },
      {
        id: "l-as1-3", courseId: "as-1", title: "Thuật toán SLAM", 
        contentUrl: "/content/as1/lesson3.mp4", requireRobot: true, 
        duration: 6000, content: "Định vị và Lập bản đồ Đồng thời", 
        contentType: "video", orderNumber: 3, 
        solution: {algorithms: ["Gmapping", "Cartographer", "ORB-SLAM"]}
      },
      {
        id: "l-as1-4", courseId: "as-1", title: "Lập kế hoạch Đường đi", 
        requireRobot: true, 
        duration: 5400, content: "Thuật toán A*, Dijkstra, RRT", 
        contentType: "programming", orderNumber: 4, 
        solution: {algorithms: ["A*", "Dijkstra", "RRT", "RRT*"]}
      },
      {
        id: "l-as1-5", courseId: "as-1", title: "Tránh Chướng ngại vật", 
        contentUrl: "/content/as1/lesson5.mp4", requireRobot: true, 
        duration: 4800, content: "Phát hiện chướng ngại vật thời gian thực", 
        contentType: "video", orderNumber: 5, 
        solution: {methods: ["trường thế năng", "biểu đồ trường vectơ"]}
      },
      {
        id: "l-as1-6", courseId: "as-1", title: "Học máy cho Định vị", 
        requireRobot: true, 
        duration: 7200, content: "Mạng nơ-ron cho điều khiển tự hành", 
        contentType: "programming", orderNumber: 6, 
        solution: {models: ["CNN", "RNN", "Học Tăng cường"]}
      },
      {
        id: "l-as1-7", courseId: "as-1", title: "ROS Navigation Stack", 
        contentUrl: "/content/as1/lesson7.mp4", requireRobot: true, 
        duration: 6000, content: "Gói định vị ROS", 
        contentType: "video", orderNumber: 7, 
        solution: {packages: ["move_base", "amcl", "gmapping"]}
      },
      {
        id: "l-as1-8", courseId: "as-1", title: "Phối hợp Đa Robot", 
        requireRobot: true, 
        duration: 5400, content: "Quản lý đội robot", 
        contentType: "programming", orderNumber: 8, 
        solution: {coordination: ["dựa trên đấu giá", "dựa trên thị trường", "đồng thuận"]}
      },
      {
        id: "l-as1-9", courseId: "as-1", title: "Hệ thống Thời gian Thực", 
        contentUrl: "/content/as1/lesson9.mp4", requireRobot: true, 
        duration: 4800, content: "Ràng buộc thời gian thực cứng", 
        contentType: "video", orderNumber: 9, 
        solution: {rtos: ["ROS2", "Xenomai", "RTAI"]}
      },
      {
        id: "l-as1-10", courseId: "as-1", title: "Kiểm thử và Xác nhận", 
        requireRobot: false, 
        duration: 3600, content: "Kiểm thử hệ thống tự hành", 
        contentType: "text", orderNumber: 10, solution: null
      },
      {
        id: "l-as1-11", courseId: "as-1", title: "Nghiên cứu Tình huống: Xe Tự lái", 
        contentUrl: "/content/as1/lesson11.mp4", requireRobot: false, 
        duration: 4200, content: "Ứng dụng ngành", 
        contentType: "video", orderNumber: 11, solution: null
      },
      {
        id: "l-as1-12", courseId: "as-1", title: "Dự án Cuối khóa", 
        requireRobot: true, 
        duration: 9000, content: "Xây dựng hệ thống định vị tự hành", 
        contentType: "programming", orderNumber: 12, 
        solution: {requirements: ["lập bản đồ", "định vị", "lập kế hoạch đường đi", "tránh chướng ngại vật"]}
      }
    ]
  },
  {
    id: "as-2", name: "Hệ thống Điều khiển Drone", description: "Xây dựng và lập trình hệ thống drone tự hành", price: 199.99, requireLicense: true, level: 3, totalLessons: 18, status: 1, createdDate: "2024-02-12", totalDuration: 540, categoryId: "4", slug: "drone-control-systems"
  },
  {
    id: "rv-1", name: "Thị giác Máy tính cho Robotics", description: "Xử lý hình ảnh và nhận dạng đối tượng cho robot", price: 229.99, requireLicense: false, level: 3, totalLessons: 20, status: 1, createdDate: "2024-02-10", totalDuration: 600, categoryId: "5", slug: "computer-vision-robotics", imageUrl: "/images/courses/robot-vision.jpg"
  },
  {
    id: "rv-2", name: "LiDAR và Cảm biến Độ sâu", description: "Kỹ thuật nhận thức 3D và lập bản đồ môi trường", price: 279.99, requireLicense: false, level: 4, totalLessons: 16, status: 1, createdDate: "2024-02-18", totalDuration: 480, categoryId: "5", slug: "lidar-depth-sensing"
  },
  {
    id: "ra-1", name: "Nguyên lý Động học Robot", description: "Động học thuận và nghịch cho cánh tay robot", price: 189.99, requireLicense: false, level: 3, totalLessons: 15, status: 1, createdDate: "2024-02-15", totalDuration: 450, categoryId: "6", slug: "robot-kinematics-fundamentals", imageUrl: "/images/courses/robotic-arm.jpg"
  },
  {
    id: "ra-2", name: "Điều khiển Chuyển động Nâng cao", description: "Điều khiển chính xác và lập kế hoạch quỹ đạo", price: 239.99, requireLicense: false, level: 4, totalLessons: 18, status: 1, createdDate: "2024-02-22", totalDuration: 540, categoryId: "6", slug: "advanced-motion-control"
  },
  {
    id: "sr-1", name: "Thuật toán Trí tuệ Bầy đàn", description: "Hành vi tập thể và hệ thống điều khiển phi tập trung", price: 219.99, requireLicense: false, level: 4, totalLessons: 17, status: 1, createdDate: "2024-03-01", totalDuration: 510, categoryId: "7", slug: "swarm-intelligence-algorithms", imageUrl: "/images/courses/swarm-robotics.jpg"
  },
  {
    id: "sr-2", name: "Phối hợp Đa Robot", description: "Truyền thông và phân bổ nhiệm vụ trong đội robot", price: 259.99, requireLicense: false, level: 4, totalLessons: 19, status: 1, createdDate: "2024-03-08", totalDuration: 570, categoryId: "7", slug: "multi-robot-coordination"
  },
  {
    id: "hr-1", 
    name: "Thiết kế Robotics Xã hội", 
    description: "Tạo robot tương tác tự nhiên với con người", 
    price: 179.99, 
    requireLicense: false, 
    level: 3, 
    totalLessons: 14, 
    status: 1, 
    createdDate: "2024-03-05", 
    totalDuration: 420, 
    categoryId: "8", 
    slug: "social-robotics-design", 
    imageUrl: "/images/courses/human-robot.jpg",
    lessons: [
      {
        id: "l-hr1-1", courseId: "hr-1", title: "Giới thiệu Robotics Xã hội", 
        contentUrl: "/content/hr1/lesson1.mp4", requireRobot: false, 
        duration: 1800, content: "Điều gì tạo nên một robot xã hội", 
        contentType: "video", orderNumber: 1, solution: null
      },
      {
        id: "l-hr1-2", courseId: "hr-1", title: "Nguyên tắc Tương tác Người-Máy", 
        requireRobot: false, 
        duration: 2400, content: "Nguyên tắc thiết kế HRI", 
        contentType: "text", orderNumber: 2, solution: null
      },
      {
        id: "l-hr1-3", courseId: "hr-1", title: "Thiết kế Biểu cảm Khuôn mặt", 
        contentUrl: "/content/hr1/lesson3.mp4", requireRobot: true, 
        duration: 3600, content: "Thiết kế biểu cảm robot", 
        contentType: "video", orderNumber: 3, 
        solution: {expressions: ["vui", "buồn", "ngạc nhiên", "trung lập"]}
      },
      {
        id: "l-hr1-4", courseId: "hr-1", title: "Tương tác Giọng nói", 
        requireRobot: true, 
        duration: 4200, content: "Nhận dạng và tổng hợp giọng nói", 
        contentType: "programming", orderNumber: 4, 
        solution: {technologies: ["nhận_dạng_giọng_nói", "chuyển_văn_bản_thành_giọng_nói", "NLU"]}
      },
      {
        id: "l-hr1-5", courseId: "hr-1", title: "Nhận dạng Cử chỉ", 
        contentUrl: "/content/hr1/lesson5.mp4", requireRobot: true, 
        duration: 4800, content: "Hiểu cử chỉ con người", 
        contentType: "video", orderNumber: 5, 
        solution: {gestures: ["vẫy tay", "chỉ trỏ", "vẫy gọi", "dừng lại"]}
      },
      {
        id: "l-hr1-6", courseId: "hr-1", title: "AI Cảm xúc", 
        requireRobot: true, 
        duration: 5400, content: "Hệ thống nhận dạng cảm xúc", 
        contentType: "programming", orderNumber: 6, 
        solution: {models: ["phân_tích_biểu_cảm_khuôn_mặt", "phát_hiện_cảm_xúc_giọng_nói"]}
      },
      {
        id: "l-hr1-7", courseId: "hr-1", title: "Định vị Xã hội", 
        contentUrl: "/content/hr1/lesson7.mp4", requireRobot: true, 
        duration: 4200, content: "Định vị trong không gian con người", 
        contentType: "video", orderNumber: 7, 
        solution: {behaviors: ["không gian cá nhân", "định vị đám đông", "chuẩn mực xã hội"]}
      },
      {
        id: "l-hr1-8", courseId: "hr-1", title: "Thiết kế Tính cách", 
        requireRobot: false, 
        duration: 3000, content: "Tạo tính cách robot", 
        contentType: "text", orderNumber: 8, solution: null
      },
      {
        id: "l-hr1-9", courseId: "hr-1", title: "Xem xét Đạo đức", 
        contentUrl: "/content/hr1/lesson9.mp4", requireRobot: false, 
        duration: 3600, content: "Đạo đức trong robotics xã hội", 
        contentType: "video", orderNumber: 9, solution: null
      },
      {
        id: "l-hr1-10", courseId: "hr-1", title: "Kiểm thử Người dùng", 
        requireRobot: true, 
        duration: 4800, content: "Kiểm thử tương tác robot xã hội", 
        contentType: "programming", orderNumber: 10, 
        solution: {methods: ["kiểm_thử_tính_dễ_sử_dụng", "nghiên_cứu_người_dùng", "thử_nghiệm_thực_địa"]}
      },
      {
        id: "l-hr1-11", courseId: "hr-1", title: "Nghiên cứu Tình huống: Robot Pepper", 
        contentUrl: "/content/hr1/lesson11.mp4", requireRobot: false, 
        duration: 4200, content: "Phân tích robot xã hội thương mại", 
        contentType: "video", orderNumber: 11, solution: null
      },
      {
        id: "l-hr1-12", courseId: "hr-1", title: "Dự án Cuối: Robot Xã hội", 
        requireRobot: true, 
        duration: 7200, content: "Thiết kế và triển khai hành vi xã hội", 
        contentType: "programming", orderNumber: 12, 
        solution: {requirements: ["tương tác", "biểu cảm", "định vị", "tính cách"]}
      }
    ]
  },
  {
    id: "hr-2", name: "Robotics Hợp tác (Cobots)", description: "Cộng tác người-máy an toàn trong không gian làm việc chung", price: 229.99, requireLicense: true, level: 3, totalLessons: 16, status: 1, createdDate: "2024-03-12", totalDuration: 480, categoryId: "8", slug: "collaborative-robotics"
  },
  {
    id: "mr-1", name: "Định vị Robot Di động", description: "Định vị, lập bản đồ và lập kế hoạch đường đi cho nền tảng di động", price: 209.99, requireLicense: false, level: 3, totalLessons: 18, status: 1, createdDate: "2024-03-10", totalDuration: 540, categoryId: "9", slug: "mobile-robot-navigation", imageUrl: "/images/courses/mobile-robotics.jpg"
  },
  {
    id: "mr-2", name: "Thiết kế Robot Bánh xe", description: "Thiết kế cơ khí và điều khiển robot di động bánh xe", price: 189.99, requireLicense: false, level: 2, totalLessons: 15, status: 1, createdDate: "2024-03-17", totalDuration: 450, categoryId: "9", slug: "wheeled-robot-design"
  },
  {
    id: "rs-1", 
    name: "Môi trường Mô phỏng Gazebo", 
    description: "Tạo và kiểm tra robot trong môi trường ảo", 
    price: 169.99, 
    requireLicense: false, 
    level: 3, 
    totalLessons: 16, 
    status: 1, 
    createdDate: "2024-03-15", 
    totalDuration: 480, 
    categoryId: "10", 
    slug: "gazebo-simulation-environment", 
    imageUrl: "/images/courses/robotic-simulation.jpg",
    lessons: [
      {
        id: "l-rs1-1", courseId: "rs-1", title: "Cài đặt Gazebo", 
        contentUrl: "/content/rs1/lesson1.mp4", requireRobot: false, 
        duration: 2400, content: "Cài đặt và cấu hình Gazebo", 
        contentType: "video", orderNumber: 1, solution: null
      },
      {
        id: "l-rs1-2", courseId: "rs-1", title: "Xây dựng Thế giới Cơ bản", 
        requireRobot: false, 
        duration: 3600, content: "Tạo môi trường mô phỏng đơn giản", 
        contentType: "programming", orderNumber: 2, 
        solution: {elements: ["tường", "vật thể", "ánh sáng", "kết cấu"]}
      },
      {
        id: "l-rs1-3", courseId: "rs-1", title: "Tạo Mô hình Robot", 
        contentUrl: "/content/rs1/lesson3.mp4", requireRobot: false, 
        duration: 4800, content: "Thiết kế mô hình robot tùy chỉnh", 
        contentType: "video", orderNumber: 3, 
        solution: {components: ["liên kết", "khớp nối", "cảm biến", "bộ điều khiển"]}
      },
      {
        id: "l-rs1-4", courseId: "rs-1", title: "Tệp URDF", 
        requireRobot: false, 
        duration: 4200, content: "Định dạng Mô tả Robot Thống nhất", 
        contentType: "programming", orderNumber: 4, 
        solution: {syntax: ["link", "joint", "transmission", "gazebo"]}
      },
      {
        id: "l-rs1-5", courseId: "rs-1", title: "Mô phỏng Cảm biến", 
        contentUrl: "/content/rs1/lesson5.mp4", requireRobot: false, 
        duration: 5400, content: "Mô phỏng camera, LiDAR, IMU", 
        contentType: "video", orderNumber: 5, 
        solution: {sensors: ["camera", "lidar", "imu", "gps"]}
      },
      {
        id: "l-rs1-6", courseId: "rs-1", title: "Công cụ Vật lý", 
        requireRobot: false, 
        duration: 3600, content: "Công cụ vật lý ODE, Bullet", 
        contentType: "text", orderNumber: 6, solution: null
      },
      {
        id: "l-rs1-7", courseId: "rs-1", title: "Tích hợp ROS", 
        contentUrl: "/content/rs1/lesson7.mp4", requireRobot: false, 
        duration: 4800, content: "Kết nối Gazebo với ROS", 
        contentType: "video", orderNumber: 7, 
        solution: {plugins: ["libgazebo_ros_api_plugin", "ros_control"]}
      },
      {
        id: "l-rs1-8", courseId: "rs-1", title: "Phát triển Plugin", 
        requireRobot: false, 
        duration: 6000, content: "Tạo plugin Gazebo tùy chỉnh", 
        contentType: "programming", orderNumber: 8, 
        solution: {languages: ["C++", "Python"], apis: ["gazebo::ModelPlugin"]}
      },
      {
        id: "l-rs1-9", courseId: "rs-1", title: "Môi trường Nâng cao", 
        contentUrl: "/content/rs1/lesson9.mp4", requireRobot: false, 
        duration: 5400, content: "Kịch bản mô phỏng phức tạp", 
        contentType: "video", orderNumber: 9, 
        solution: {environments: ["ngoài trời", "trong nhà", "động", "đa robot"]}
      },
      {
        id: "l-rs1-10", courseId: "rs-1", title: "Tối ưu hóa Hiệu suất", 
        requireRobot: false, 
        duration: 4200, content: "Tối ưu hóa hiệu suất mô phỏng", 
        contentType: "programming", orderNumber: 10, 
        solution: {techniques: ["mức_chi_tiết", "đa luồng", "tăng_tốc_GPU"]}
      },
      {
        id: "l-rs1-11", courseId: "rs-1", title: "Dự án Cuối: Mô phỏng Robot Hoàn chỉnh", 
        requireRobot: false, 
        duration: 7200, content: "Xây dựng mô phỏng robot hoàn chỉnh", 
        contentType: "programming", orderNumber: 11, 
        solution: {requirements: ["mô_hình_robot", "môi_trường", "cảm_biến", "bộ_điều_khiển"]}
      }
    ]
  },
  {
    id: "rs-2", name: "Phát triển Bản sao Kỹ thuật số", description: "Tạo bản sao kỹ thuật số của hệ thống robot vật lý", price: 289.99, requireLicense: false, level: 4, totalLessons: 20, status: 1, createdDate: "2024-03-22", totalDuration: 600, categoryId: "10", slug: "digital-twin-development"
  }
]