import { Category, Course } from "@/types/courses";
import { PagedResult } from "@/types/page-result";

export const categories: Category[] = [
  {
    id: "1",
    name: "Robotics Fundamentals",
    description: "Basic principles and concepts of robotics including mechanics, electronics, and programming",
    slug: "robotics-fundamentals",
    imageUrl: "/images/categories/robotics-fundamentals.jpg",
    status: 1,
    createdDate: "2024-01-15"
  },
  {
    id: "2",
    name: "Robot Programming",
    description: "Programming languages and techniques for controlling robots and automation systems",
    slug: "robot-programming",
    imageUrl: "/images/categories/robot-programming.jpg",
    status: 1,
    createdDate: "2024-01-20"
  },
  {
    id: "3",
    name: "Industrial Robotics",
    description: "Automation and robotic systems for manufacturing, assembly lines, and industrial applications",
    slug: "industrial-robotics",
    imageUrl: "/images/categories/industrial-robotics.jpg",
    status: 1,
    createdDate: "2024-02-05"
  },
  {
    id: "4",
    name: "Autonomous Systems",
    description: "Self-driving robots, drones, and autonomous vehicles with AI and sensor integration",
    slug: "autonomous-systems",
    imageUrl: "/images/categories/autonomous-systems.jpg",
    status: 1,
    createdDate: "2024-02-12"
  },
  {
    id: "5",
    name: "Robot Vision & Sensors",
    description: "Computer vision, LiDAR, ultrasonic sensors and perception systems for robots",
    slug: "robot-vision-sensors",
    imageUrl: "/images/categories/robot-vision.jpg",
    status: 1,
    createdDate: "2024-02-18"
  },
  {
    id: "6",
    name: "Robotic Arm Control",
    description: "Kinematics, dynamics, and precise control of robotic manipulators and arms",
    slug: "robotic-arm-control",
    imageUrl: "/images/categories/robotic-arm.jpg",
    status: 1,
    createdDate: "2024-03-01"
  },
  {
    id: "7",
    name: "Swarm Robotics",
    description: "Coordinated control of multiple robots working together as a swarm system",
    slug: "swarm-robotics",
    imageUrl: "/images/categories/swarm-robotics.jpg",
    status: 1,
    createdDate: "2024-03-10"
  },
  {
    id: "8",
    name: "Human-Robot Interaction",
    description: "Designing robots that can safely and effectively interact with humans",
    slug: "human-robot-interaction",
    imageUrl: "/images/categories/human-robot-interaction.jpg",
    status: 1,
    createdDate: "2024-03-15"
  },
  {
    id: "9",
    name: "Mobile Robotics",
    description: "Navigation, path planning, and control of wheeled and legged mobile robots",
    slug: "mobile-robotics",
    imageUrl: "/images/categories/mobile-robotics.jpg",
    status: 1,
    createdDate: "2024-03-22"
  },
  {
    id: "10",
    name: "Robotic Simulation",
    description: "Virtual environments and tools for simulating and testing robotic systems",
    slug: "robotic-simulation",
    imageUrl: "/images/categories/robotic-simulation.jpg",
    status: 1,
    createdDate: "2024-03-30"
  }
];

const courses: Course[] = [
  {
    id: "rf-1", name: "Introduction to Robotics", description: "Learn the basic concepts and history of robotics", price: 89.99, requireLicense: false, level: 1, totalLessons: 12, status: 1, createdDate: "2024-01-20", totalDuration: 360, categoryId: "1", slug: "introduction-to-robotics", imageUrl: "/images/courses/robotics-intro.jpg"
  },
  {
    id: "rf-2", name: "Robotics Mathematics", description: "Essential math for robotics including linear algebra and calculus", price: 129.99, requireLicense: false, level: 2, totalLessons: 18, status: 1, createdDate: "2024-01-25", totalDuration: 540, categoryId: "1", slug: "robotics-mathematics"
  },
  {
    id: "rf-3", name: "Electronics for Robotics", description: "Circuit design, sensors, and electronic components", price: 149.99, requireLicense: false, level: 2, totalLessons: 15, status: 1, createdDate: "2024-02-01", totalDuration: 450, categoryId: "1", slug: "electronics-for-robotics"
  },
  {
    id: "rf-4", name: "Mechanical Design Basics", description: "CAD modeling and mechanical principles for robots", price: 119.99, requireLicense: true, level: 2, totalLessons: 14, status: 1, createdDate: "2024-02-10", totalDuration: 420, categoryId: "1", slug: "mechanical-design-basics"
  },
  {
    id: "rf-5", name: "Robotics Safety Standards", description: "Industry safety protocols and best practices", price: 79.99, requireLicense: true, level: 1, totalLessons: 8, status: 1, createdDate: "2024-02-15", totalDuration: 240, categoryId: "1", slug: "robotics-safety-standards"
  }, {
    id: "rp-1", name: "Python for Robotics", description: "Master Python programming specifically for robotic applications", price: 159.99, requireLicense: false, level: 2, totalLessons: 20, status: 1, createdDate: "2024-01-22", totalDuration: 600, categoryId: "2", slug: "python-for-robotics", imageUrl: "/images/courses/python-robotics.jpg"
  },
  {
    id: "rp-2", name: "ROS (Robot Operating System) Fundamentals", description: "Complete guide to ROS for robot software development", price: 199.99, requireLicense: false, level: 3, totalLessons: 25, status: 1, createdDate: "2024-01-30", totalDuration: 750, categoryId: "2", slug: "ros-fundamentals"
  },
  {
    id: "rp-3", name: "C++ for Embedded Robotics", description: "High-performance programming for real-time robotic systems", price: 179.99, requireLicense: false, level: 3, totalLessons: 22, status: 1, createdDate: "2024-02-05", totalDuration: 660, categoryId: "2", slug: "cpp-embedded-robotics"
  },
  {
    id: "rp-4", name: "MATLAB for Robotics Control", description: "Algorithm development and simulation using MATLAB", price: 149.99, requireLicense: true, level: 2, totalLessons: 16, status: 1, createdDate: "2024-02-12", totalDuration: 480, categoryId: "2", slug: "matlab-robotics-control"
  },
  {
    id: "rp-5", name: "Real-Time Robot Programming", description: "Hard real-time systems and deterministic control", price: 219.99, requireLicense: false, level: 4, totalLessons: 18, status: 1, createdDate: "2024-02-20", totalDuration: 540, categoryId: "2", slug: "real-time-robot-programming"
  },
  {
    id: "ir-1", name: "Industrial Robot Programming", description: "Programming FANUC, KUKA, and ABB industrial robots", price: 299.99, requireLicense: true, level: 3, totalLessons: 24, status: 1, createdDate: "2024-02-01", totalDuration: 720, categoryId: "3", slug: "industrial-robot-programming", imageUrl: "/images/courses/industrial-robotics.jpg"
  },
  {
    id: "ir-2", name: "Automated Manufacturing Systems", description: "Design and implement complete automation solutions", price: 349.99, requireLicense: true, level: 4, totalLessons: 28, status: 1, createdDate: "2024-02-08", totalDuration: 840, categoryId: "3", slug: "automated-manufacturing-systems"
  },
  {
    id: "ir-3", name: "PLC Integration with Robotics", description: "Connect robots with programmable logic controllers", price: 279.99, requireLicense: true, level: 3, totalLessons: 20, status: 1, createdDate: "2024-02-15", totalDuration: 600, categoryId: "3", slug: "plc-robotics-integration"
  },
  {
    id: "as-1", name: "Autonomous Navigation Algorithms", description: "Path planning and obstacle avoidance for self-driving systems", price: 249.99, requireLicense: false, level: 4, totalLessons: 22, status: 1, createdDate: "2024-02-05", totalDuration: 660, categoryId: "4", slug: "autonomous-navigation-algorithms", imageUrl: "/images/courses/autonomous-navigation.jpg"
  },
  {
    id: "as-2", name: "Drone Control Systems", description: "Build and program autonomous drone systems", price: 199.99, requireLicense: true, level: 3, totalLessons: 18, status: 1, createdDate: "2024-02-12", totalDuration: 540, categoryId: "4", slug: "drone-control-systems"
  },
  {
    id: "rv-1", name: "Computer Vision for Robotics", description: "Image processing and object recognition for robots", price: 229.99, requireLicense: false, level: 3, totalLessons: 20, status: 1, createdDate: "2024-02-10", totalDuration: 600, categoryId: "5", slug: "computer-vision-robotics", imageUrl: "/images/courses/robot-vision.jpg"
  },
  {
    id: "rv-2", name: "LiDAR and Depth Sensing", description: "3D perception and environment mapping techniques", price: 279.99, requireLicense: false, level: 4, totalLessons: 16, status: 1, createdDate: "2024-02-18", totalDuration: 480, categoryId: "5", slug: "lidar-depth-sensing"
  },
  {
    id: "ra-1", name: "Robot Kinematics Fundamentals", description: "Forward and inverse kinematics for robotic arms", price: 189.99, requireLicense: false, level: 3, totalLessons: 15, status: 1, createdDate: "2024-02-15", totalDuration: 450, categoryId: "6", slug: "robot-kinematics-fundamentals", imageUrl: "/images/courses/robotic-arm.jpg"
  },
  {
    id: "ra-2", name: "Advanced Motion Control", description: "Precision control and trajectory planning", price: 239.99, requireLicense: false, level: 4, totalLessons: 18, status: 1, createdDate: "2024-02-22", totalDuration: 540, categoryId: "6", slug: "advanced-motion-control"
  },
  {
    id: "sr-1", name: "Swarm Intelligence Algorithms", description: "Collective behavior and decentralized control systems", price: 219.99, requireLicense: false, level: 4, totalLessons: 17, status: 1, createdDate: "2024-03-01", totalDuration: 510, categoryId: "7", slug: "swarm-intelligence-algorithms", imageUrl: "/images/courses/swarm-robotics.jpg"
  },
  {
    id: "sr-2", name: "Multi-Robot Coordination", description: "Communication and task allocation in robot teams", price: 259.99, requireLicense: false, level: 4, totalLessons: 19, status: 1, createdDate: "2024-03-08", totalDuration: 570, categoryId: "7", slug: "multi-robot-coordination"
  },
  {
    id: "hr-1", name: "Social Robotics Design", description: "Creating robots that interact naturally with humans", price: 179.99, requireLicense: false, level: 3, totalLessons: 14, status: 1, createdDate: "2024-03-05", totalDuration: 420, categoryId: "8", slug: "social-robotics-design", imageUrl: "/images/courses/human-robot.jpg"
  },
  {
    id: "hr-2", name: "Collaborative Robotics (Cobots)", description: "Safe human-robot collaboration in shared workspaces", price: 229.99, requireLicense: true, level: 3, totalLessons: 16, status: 1, createdDate: "2024-03-12", totalDuration: 480, categoryId: "8", slug: "collaborative-robotics"
  },
  {
    id: "mr-1", name: "Mobile Robot Navigation", description: "Localization, mapping, and path planning for mobile platforms", price: 209.99, requireLicense: false, level: 3, totalLessons: 18, status: 1, createdDate: "2024-03-10", totalDuration: 540, categoryId: "9", slug: "mobile-robot-navigation", imageUrl: "/images/courses/mobile-robotics.jpg"
  },
  {
    id: "mr-2", name: "Wheeled Robot Design", description: "Mechanical design and control of wheeled mobile robots", price: 189.99, requireLicense: false, level: 2, totalLessons: 15, status: 1, createdDate: "2024-03-17", totalDuration: 450, categoryId: "9", slug: "wheeled-robot-design"
  },
  {
    id: "rs-1", name: "Gazebo Simulation Environment", description: "Create and test robots in virtual environments", price: 169.99, requireLicense: false, level: 3, totalLessons: 16, status: 1, createdDate: "2024-03-15", totalDuration: 480, categoryId: "10", slug: "gazebo-simulation-environment", imageUrl: "/images/courses/robotic-simulation.jpg"
  },
  {
    id: "rs-2", name: "Digital Twin Development", description: "Create digital replicas of physical robotic systems", price: 289.99, requireLicense: false, level: 4, totalLessons: 20, status: 1, createdDate: "2024-03-22", totalDuration: 600, categoryId: "10", slug: "digital-twin-development"
  }
]
export const getCategories = async (): Promise<PagedResult<Category>> => {
  return {
    data: categories,
    has_next: false,
    has_previous: false,
    page: 1,
    per_page: 10,
    total_count: 10,
    total_pages: 1
  }
}

export const getCourses = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
  // Handle abort signal
  if (signal?.aborted) {
    throw new Error('Request aborted');
  }

  // Filter courses by search term if provided
  let filteredCourses = courses;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredCourses = courses.filter(course => 
      course.name.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.slug.toLowerCase().includes(searchLower) || 
      course.categoryId.toLowerCase().includes(searchLower)
    );
  }

  // Calculate pagination values
  const totalCount = filteredCourses.length;
  const totalPages = Math.ceil(totalCount / size);
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;

  // Get paginated slice
  const sliced = filteredCourses.slice(startIndex, endIndex);
  
  // Check if there are next/previous pages
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;

  return {
    data: sliced,
    has_next: hasNext,
    has_previous: hasPrevious,
    page: page,
    per_page: size,
    total_count: totalCount,
    total_pages: totalPages
  };
};

export const getCourseBySlug = async (slug: string) => {
  return courses.find(x => x.slug === slug)
}

export const getCategoryBySlug = async (slug: string) => {
  return categories.find(x => x.slug === slug)
}