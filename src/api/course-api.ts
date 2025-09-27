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
    id: "rf-1",
    name: "Introduction to Robotics",
    description: "Learn the basic concepts and history of robotics",
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
        id: "l-rf1-1", courseId: "rf-1", title: "What is Robotics?",
        contentUrl: "/content/rf1/lesson1.mp4", requireRobot: false,
        duration: 1200, content: "Introduction to robotics concepts",
        contentType: "video", orderNumber: 1, solution: null
      },
      {
        id: "l-rf1-2", courseId: "rf-1", title: "History of Robotics",
        contentUrl: "/content/rf1/lesson2.mp4", requireRobot: false,
        duration: 1800, content: "Historical development of robots",
        contentType: "video", orderNumber: 2, solution: null
      },
      {
        id: "l-rf1-3", courseId: "rf-1", title: "Types of Robots",
        contentUrl: "/content/rf1/lesson3.mp4", requireRobot: false,
        duration: 1500, content: "Different categories of robots",
        contentType: "video", orderNumber: 3, solution: null
      },
      {
        id: "l-rf1-4", courseId: "rf-1", title: "Basic Robot Components",
        requireRobot: false,
        duration: 2400, content: "Sensors, actuators, controllers",
        contentType: "text", orderNumber: 4, solution: null
      },
      {
        id: "l-rf1-5", courseId: "rf-1", title: "Robot Applications",
        contentUrl: "/content/rf1/lesson5.mp4", requireRobot: false,
        duration: 2100, content: "Real-world applications",
        contentType: "video", orderNumber: 5, solution: null
      },
      {
        id: "l-rf1-6", courseId: "rf-1", title: "Safety Fundamentals",
        requireRobot: false,
        duration: 1800, content: "Safety protocols and practices",
        contentType: "text", orderNumber: 6, solution: null
      },
      {
        id: "l-rf1-7", courseId: "rf-1", title: "Programming Basics",
        contentUrl: "/content/rf1/lesson7.mp4", requireRobot: true,
        duration: 2700, content: "Introduction to robot programming",
        contentType: "video", orderNumber: 7, solution: { exercise: "simple_movement" }
      },
      {
        id: "l-rf1-8", courseId: "rf-1", title: "First Robot Exercise",
        requireRobot: true,
        duration: 3600, content: "Hands-on robot control",
        contentType: "programming", orderNumber: 8,
        solution: { code: "robot.move_forward(100)", explanation: "Basic movement command" }
      },
      {
        id: "l-rf1-9", courseId: "rf-1", title: "Troubleshooting Basics",
        contentUrl: "/content/rf1/lesson9.mp4", requireRobot: false,
        duration: 1500, content: "Common issues and solutions",
        contentType: "video", orderNumber: 9, solution: null
      },
      {
        id: "l-rf1-10", courseId: "rf-1", title: "Industry Trends",
        requireRobot: false,
        duration: 2100, content: "Current robotics trends",
        contentType: "text", orderNumber: 10, solution: null
      },
      {
        id: "l-rf1-11", courseId: "rf-1", title: "Final Project Setup",
        requireRobot: true,
        duration: 3000, content: "Prepare for final project",
        contentType: "programming", orderNumber: 11,
        solution: { requirements: ["sensors", "movement", "logic"] }
      },
      {
        id: "l-rf1-12", courseId: "rf-1", title: "Course Review",
        contentUrl: "/content/rf1/lesson12.mp4", requireRobot: false,
        duration: 1200, content: "Summary of key concepts",
        contentType: "video", orderNumber: 12, solution: null
      }
    ]
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
    id: "rp-1", 
    name: "Python for Robotics", 
    description: "Master Python programming specifically for robotic applications", 
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
        id: "l-rp1-1", courseId: "rp-1", title: "Python Setup for Robotics", 
        contentUrl: "/content/rp1/lesson1.mp4", requireRobot: false, 
        duration: 1800, content: "Install Python and robotics libraries", 
        contentType: "video", orderNumber: 1, solution: null
      },
      {
        id: "l-rp1-2", courseId: "rp-1", title: "Basic Python Syntax", 
        requireRobot: false, 
        duration: 2400, content: "Variables, loops, functions", 
        contentType: "text", orderNumber: 2, solution: null
      },
      {
        id: "l-rp1-3", courseId: "rp-1", title: "Robot Control with Python", 
        contentUrl: "/content/rp1/lesson3.mp4", requireRobot: true, 
        duration: 2700, content: "Controlling robot movements", 
        contentType: "video", orderNumber: 3, 
        solution: {code: "import robot\nrobot.forward()"}
      },
      {
        id: "l-rp1-4", courseId: "rp-1", title: "Sensor Data Processing", 
        requireRobot: true, 
        duration: 3000, content: "Reading and processing sensor data", 
        contentType: "programming", orderNumber: 4, 
        solution: {code: "sensor_data = robot.read_sensor()"}
      },
      {
        id: "l-rp1-5", courseId: "rp-1", title: "Object-Oriented Programming", 
        contentUrl: "/content/rp1/lesson5.mp4", requireRobot: false, 
        duration: 3600, content: "Classes and objects for robots", 
        contentType: "video", orderNumber: 5, solution: null
      },
      {
        id: "l-rp1-6", courseId: "rp-1", title: "Robot Class Implementation", 
        requireRobot: true, 
        duration: 4200, content: "Create a Robot class", 
        contentType: "programming", orderNumber: 6, 
        solution: {code: "class Robot:\n    def __init__(self):\n        self.position = 0"}
      },
      {
        id: "l-rp1-7", courseId: "rp-1", title: "Error Handling", 
        requireRobot: false, 
        duration: 2100, content: "Try-except blocks for robotics", 
        contentType: "text", orderNumber: 7, solution: null
      },
      {
        id: "l-rp1-8", courseId: "rp-1", title: "Multi-threading for Robots", 
        contentUrl: "/content/rp1/lesson8.mp4", requireRobot: true, 
        duration: 4800, content: "Concurrent robot operations", 
        contentType: "video", orderNumber: 8, 
        solution: {code: "import threading\nthread = threading.Thread(target=robot_task)"}
      },
      {
        id: "l-rp1-9", courseId: "rp-1", title: "API Integration", 
        requireRobot: false, 
        duration: 3300, content: "Connect to robot APIs", 
        contentType: "programming", orderNumber: 9, 
        solution: {code: "import requests\nresponse = requests.get('api/robot/status')"}
      },
      {
        id: "l-rp1-10", courseId: "rp-1", title: "Data Visualization", 
        contentUrl: "/content/rp1/lesson10.mp4", requireRobot: false, 
        duration: 2700, content: "Plot robot sensor data", 
        contentType: "video", orderNumber: 10, solution: null
      },
      {
        id: "l-rp1-11", courseId: "rp-1", title: "Advanced Algorithms", 
        requireRobot: true, 
        duration: 5400, content: "Path planning algorithms", 
        contentType: "programming", orderNumber: 11, 
        solution: {algorithm: "A*", implementation: "path_finding.py"}
      },
      {
        id: "l-rp1-12", courseId: "rp-1", title: "Testing Robot Code", 
        requireRobot: false, 
        duration: 2400, content: "Unit testing for robotics", 
        contentType: "text", orderNumber: 12, solution: null
      },
      {
        id: "l-rp1-13", courseId: "rp-1", title: "Performance Optimization", 
        contentUrl: "/content/rp1/lesson13.mp4", requireRobot: true, 
        duration: 3600, content: "Optimize robot code performance", 
        contentType: "video", orderNumber: 13, 
        solution: {techniques: ["caching", "async", "optimized_algorithms"]}
      },
      {
        id: "l-rp1-14", courseId: "rp-1", title: "Final Project: Autonomous Robot", 
        requireRobot: true, 
        duration: 7200, content: "Build an autonomous robot system", 
        contentType: "programming", orderNumber: 14, 
        solution: {project: "autonomous_navigation", requirements: ["sensors", "mapping", "control"]}
      }
    ]
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
    id: "ir-1", 
    name: "Industrial Robot Programming", 
    description: "Programming FANUC, KUKA, and ABB industrial robots", 
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
        id: "l-ir1-1", courseId: "ir-1", title: "Industrial Safety Standards", 
        contentUrl: "/content/ir1/lesson1.mp4", requireRobot: false, 
        duration: 3600, content: "Safety protocols for industrial robots", 
        contentType: "video", orderNumber: 1, solution: null
      },
      {
        id: "l-ir1-2", courseId: "ir-1", title: "FANUC Robot Interface", 
        requireRobot: true, 
        duration: 4200, content: "FANUC controller programming", 
        contentType: "programming", orderNumber: 2, 
        solution: {interface: "TP", commands: ["J", "L", "C"]}
      },
      {
        id: "l-ir1-3", courseId: "ir-1", title: "KUKA System Overview", 
        contentUrl: "/content/ir1/lesson3.mp4", requireRobot: true, 
        duration: 4800, content: "KUKA robot programming", 
        contentType: "video", orderNumber: 3, 
        solution: {system: "KRC4", language: "KRL"}
      },
      {
        id: "l-ir1-4", courseId: "ir-1", title: "ABB RobotStudio", 
        requireRobot: true, 
        duration: 5400, content: "ABB programming environment", 
        contentType: "programming", orderNumber: 4, 
        solution: {software: "RobotStudio", features: ["simulation", "offline_programming"]}
      },
      {
        id: "l-ir1-5", courseId: "ir-1", title: "Path Planning", 
        contentUrl: "/content/ir1/lesson5.mp4", requireRobot: true, 
        duration: 6000, content: "Industrial robot path planning", 
        contentType: "video", orderNumber: 5, 
        solution: {algorithms: ["linear", "circular", "spline"]}
      },
      {
        id: "l-ir1-6", courseId: "ir-1", title: "Payload Calculation", 
        requireRobot: false, 
        duration: 3000, content: "Calculate robot payload capacity", 
        contentType: "text", orderNumber: 6, solution: null
      },
      {
        id: "l-ir1-7", courseId: "ir-1", title: "Tool Center Point Setup", 
        contentUrl: "/content/ir1/lesson7.mp4", requireRobot: true, 
        duration: 4800, content: "TCP configuration and calibration", 
        contentType: "video", orderNumber: 7, 
        solution: {calibration: "4-point", accuracy: "0.1mm"}
      },
      {
        id: "l-ir1-8", courseId: "ir-1", title: "I/O Integration", 
        requireRobot: true, 
        duration: 4200, content: "PLC and sensor integration", 
        contentType: "programming", orderNumber: 8, 
        solution: {protocols: ["Profibus", "Ethernet/IP", "DeviceNet"]}
      },
      {
        id: "l-ir1-9", courseId: "ir-1", title: "Error Handling", 
        contentUrl: "/content/ir1/lesson9.mp4", requireRobot: true, 
        duration: 3600, content: "Industrial robot error recovery", 
        contentType: "video", orderNumber: 9, 
        solution: {errors: ["collision", "overtravel", "communication"]}
      },
      {
        id: "l-ir1-10", courseId: "ir-1", title: "Maintenance Procedures", 
        requireRobot: false, 
        duration: 2400, content: "Preventive maintenance", 
        contentType: "text", orderNumber: 10, solution: null
      },
      {
        id: "l-ir1-11", courseId: "ir-1", title: "Advanced Programming", 
        contentUrl: "/content/ir1/lesson11.mp4", requireRobot: true, 
        duration: 6600, content: "Complex industrial applications", 
        contentType: "video", orderNumber: 11, 
        solution: {applications: ["welding", "painting", "assembly"]}
      },
      {
        id: "l-ir1-12", courseId: "ir-1", title: "Quality Control", 
        requireRobot: true, 
        duration: 4200, content: "Quality assurance in automation", 
        contentType: "programming", orderNumber: 12, 
        solution: {metrics: ["repeatability", "accuracy", "cycle_time"]}
      }
    ]
  },
  {
    id: "ir-2", name: "Automated Manufacturing Systems", description: "Design and implement complete automation solutions", price: 349.99, requireLicense: true, level: 4, totalLessons: 28, status: 1, createdDate: "2024-02-08", totalDuration: 840, categoryId: "3", slug: "automated-manufacturing-systems"
  },
  {
    id: "ir-3", name: "PLC Integration with Robotics", description: "Connect robots with programmable logic controllers", price: 279.99, requireLicense: true, level: 3, totalLessons: 20, status: 1, createdDate: "2024-02-15", totalDuration: 600, categoryId: "3", slug: "plc-robotics-integration"
  },
  {
    id: "as-1", 
    name: "Autonomous Navigation Algorithms", 
    description: "Path planning and obstacle avoidance for self-driving systems", 
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
        id: "l-as1-1", courseId: "as-1", title: "Introduction to Autonomous Systems", 
        contentUrl: "/content/as1/lesson1.mp4", requireRobot: false, 
        duration: 2400, content: "Overview of autonomous navigation", 
        contentType: "video", orderNumber: 1, solution: null
      },
      {
        id: "l-as1-2", courseId: "as-1", title: "Sensor Fusion", 
        requireRobot: true, 
        duration: 4800, content: "Combining sensor data", 
        contentType: "programming", orderNumber: 2, 
        solution: {sensors: ["LiDAR", "camera", "IMU"], fusion: "Kalman_filter"}
      },
      {
        id: "l-as1-3", courseId: "as-1", title: "SLAM Algorithms", 
        contentUrl: "/content/as1/lesson3.mp4", requireRobot: true, 
        duration: 6000, content: "Simultaneous Localization and Mapping", 
        contentType: "video", orderNumber: 3, 
        solution: {algorithms: ["Gmapping", "Cartographer", "ORB-SLAM"]}
      },
      {
        id: "l-as1-4", courseId: "as-1", title: "Path Planning", 
        requireRobot: true, 
        duration: 5400, content: "A*, Dijkstra, RRT algorithms", 
        contentType: "programming", orderNumber: 4, 
        solution: {algorithms: ["A*", "Dijkstra", "RRT", "RRT*"]}
      },
      {
        id: "l-as1-5", courseId: "as-1", title: "Obstacle Avoidance", 
        contentUrl: "/content/as1/lesson5.mp4", requireRobot: true, 
        duration: 4800, content: "Real-time obstacle detection", 
        contentType: "video", orderNumber: 5, 
        solution: {methods: ["potential_fields", "vector_field_histogram"]}
      },
      {
        id: "l-as1-6", courseId: "as-1", title: "Machine Learning for Navigation", 
        requireRobot: true, 
        duration: 7200, content: "Neural networks for autonomous control", 
        contentType: "programming", orderNumber: 6, 
        solution: {models: ["CNN", "RNN", "Reinforcement_Learning"]}
      },
      {
        id: "l-as1-7", courseId: "as-1", title: "ROS Navigation Stack", 
        contentUrl: "/content/as1/lesson7.mp4", requireRobot: true, 
        duration: 6000, content: "ROS navigation package", 
        contentType: "video", orderNumber: 7, 
        solution: {packages: ["move_base", "amcl", "gmapping"]}
      },
      {
        id: "l-as1-8", courseId: "as-1", title: "Multi-Robot Coordination", 
        requireRobot: true, 
        duration: 5400, content: "Fleet management", 
        contentType: "programming", orderNumber: 8, 
        solution: {coordination: ["auction_based", "market_based", "consensus"]}
      },
      {
        id: "l-as1-9", courseId: "as-1", title: "Real-time Systems", 
        contentUrl: "/content/as1/lesson9.mp4", requireRobot: true, 
        duration: 4800, content: "Hard real-time constraints", 
        contentType: "video", orderNumber: 9, 
        solution: {rtos: ["ROS2", "Xenomai", "RTAI"]}
      },
      {
        id: "l-as1-10", courseId: "as-1", title: "Testing and Validation", 
        requireRobot: false, 
        duration: 3600, content: "Autonomous system testing", 
        contentType: "text", orderNumber: 10, solution: null
      },
      {
        id: "l-as1-11", courseId: "as-1", title: "Case Study: Self-Driving Cars", 
        contentUrl: "/content/as1/lesson11.mp4", requireRobot: false, 
        duration: 4200, content: "Industry applications", 
        contentType: "video", orderNumber: 11, solution: null
      },
      {
        id: "l-as1-12", courseId: "as-1", title: "Final Project", 
        requireRobot: true, 
        duration: 9000, content: "Build autonomous navigation system", 
        contentType: "programming", orderNumber: 12, 
        solution: {requirements: ["mapping", "localization", "path_planning", "obstacle_avoidance"]}
      }
    ]
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
    id: "hr-1", 
    name: "Social Robotics Design", 
    description: "Creating robots that interact naturally with humans", 
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
        id: "l-hr1-1", courseId: "hr-1", title: "Introduction to Social Robotics", 
        contentUrl: "/content/hr1/lesson1.mp4", requireRobot: false, 
        duration: 1800, content: "What makes a robot social", 
        contentType: "video", orderNumber: 1, solution: null
      },
      {
        id: "l-hr1-2", courseId: "hr-1", title: "Human-Robot Interaction Principles", 
        requireRobot: false, 
        duration: 2400, content: "HRI design principles", 
        contentType: "text", orderNumber: 2, solution: null
      },
      {
        id: "l-hr1-3", courseId: "hr-1", title: "Facial Expression Design", 
        contentUrl: "/content/hr1/lesson3.mp4", requireRobot: true, 
        duration: 3600, content: "Designing robot expressions", 
        contentType: "video", orderNumber: 3, 
        solution: {expressions: ["happy", "sad", "surprised", "neutral"]}
      },
      {
        id: "l-hr1-4", courseId: "hr-1", title: "Voice Interaction", 
        requireRobot: true, 
        duration: 4200, content: "Speech recognition and synthesis", 
        contentType: "programming", orderNumber: 4, 
        solution: {technologies: ["speech_recognition", "text_to_speech", "NLU"]}
      },
      {
        id: "l-hr1-5", courseId: "hr-1", title: "Gesture Recognition", 
        contentUrl: "/content/hr1/lesson5.mp4", requireRobot: true, 
        duration: 4800, content: "Human gesture understanding", 
        contentType: "video", orderNumber: 5, 
        solution: {gestures: ["wave", "point", "beckon", "stop"]}
      },
      {
        id: "l-hr1-6", courseId: "hr-1", title: "Emotion AI", 
        requireRobot: true, 
        duration: 5400, content: "Emotion recognition systems", 
        contentType: "programming", orderNumber: 6, 
        solution: {models: ["facial_expression_analysis", "voice_emotion_detection"]}
      },
      {
        id: "l-hr1-7", courseId: "hr-1", title: "Social Navigation", 
        contentUrl: "/content/hr1/lesson7.mp4", requireRobot: true, 
        duration: 4200, content: "Navigating in human spaces", 
        contentType: "video", orderNumber: 7, 
        solution: {behaviors: ["personal_space", "crowd_navigation", "social_norms"]}
      },
      {
        id: "l-hr1-8", courseId: "hr-1", title: "Personality Design", 
        requireRobot: false, 
        duration: 3000, content: "Creating robot personalities", 
        contentType: "text", orderNumber: 8, solution: null
      },
      {
        id: "l-hr1-9", courseId: "hr-1", title: "Ethical Considerations", 
        contentUrl: "/content/hr1/lesson9.mp4", requireRobot: false, 
        duration: 3600, content: "Ethics in social robotics", 
        contentType: "video", orderNumber: 9, solution: null
      },
      {
        id: "l-hr1-10", courseId: "hr-1", title: "User Testing", 
        requireRobot: true, 
        duration: 4800, content: "Testing social robot interactions", 
        contentType: "programming", orderNumber: 10, 
        solution: {methods: ["usability_testing", "user_studies", "field_trials"]}
      },
      {
        id: "l-hr1-11", courseId: "hr-1", title: "Case Study: Pepper Robot", 
        contentUrl: "/content/hr1/lesson11.mp4", requireRobot: false, 
        duration: 4200, content: "Commercial social robot analysis", 
        contentType: "video", orderNumber: 11, solution: null
      },
      {
        id: "l-hr1-12", courseId: "hr-1", title: "Final Project: Social Robot", 
        requireRobot: true, 
        duration: 7200, content: "Design and implement social behaviors", 
        contentType: "programming", orderNumber: 12, 
        solution: {requirements: ["interaction", "expression", "navigation", "personality"]}
      }
    ]
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
    id: "rs-1", 
    name: "Gazebo Simulation Environment", 
    description: "Create and test robots in virtual environments", 
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
        id: "l-rs1-1", courseId: "rs-1", title: "Gazebo Installation", 
        contentUrl: "/content/rs1/lesson1.mp4", requireRobot: false, 
        duration: 2400, content: "Install and configure Gazebo", 
        contentType: "video", orderNumber: 1, solution: null
      },
      {
        id: "l-rs1-2", courseId: "rs-1", title: "Basic World Building", 
        requireRobot: false, 
        duration: 3600, content: "Create simple simulation environments", 
        contentType: "programming", orderNumber: 2, 
        solution: {elements: ["walls", "objects", "lights", "textures"]}
      },
      {
        id: "l-rs1-3", courseId: "rs-1", title: "Robot Model Creation", 
        contentUrl: "/content/rs1/lesson3.mp4", requireRobot: false, 
        duration: 4800, content: "Design custom robot models", 
        contentType: "video", orderNumber: 3, 
        solution: {components: ["links", "joints", "sensors", "controllers"]}
      },
      {
        id: "l-rs1-4", courseId: "rs-1", title: "URDF Files", 
        requireRobot: false, 
        duration: 4200, content: "Unified Robot Description Format", 
        contentType: "programming", orderNumber: 4, 
        solution: {syntax: ["link", "joint", "transmission", "gazebo"]}
      },
      {
        id: "l-rs1-5", courseId: "rs-1", title: "Sensor Simulation", 
        contentUrl: "/content/rs1/lesson5.mp4", requireRobot: false, 
        duration: 5400, content: "Simulate cameras, LiDAR, IMU", 
        contentType: "video", orderNumber: 5, 
        solution: {sensors: ["camera", "lidar", "imu", "gps"]}
      },
      {
        id: "l-rs1-6", courseId: "rs-1", title: "Physics Engine", 
        requireRobot: false, 
        duration: 3600, content: "ODE, Bullet physics engines", 
        contentType: "text", orderNumber: 6, solution: null
      },
      {
        id: "l-rs1-7", courseId: "rs-1", title: "ROS Integration", 
        contentUrl: "/content/rs1/lesson7.mp4", requireRobot: false, 
        duration: 4800, content: "Connect Gazebo with ROS", 
        contentType: "video", orderNumber: 7, 
        solution: {plugins: ["libgazebo_ros_api_plugin", "ros_control"]}
      },
      {
        id: "l-rs1-8", courseId: "rs-1", title: "Plugin Development", 
        requireRobot: false, 
        duration: 6000, content: "Create custom Gazebo plugins", 
        contentType: "programming", orderNumber: 8, 
        solution: {languages: ["C++", "Python"], apis: ["gazebo::ModelPlugin"]}
      },
      {
        id: "l-rs1-9", courseId: "rs-1", title: "Advanced Environments", 
        contentUrl: "/content/rs1/lesson9.mp4", requireRobot: false, 
        duration: 5400, content: "Complex simulation scenarios", 
        contentType: "video", orderNumber: 9, 
        solution: {environments: ["outdoor", "indoor", "dynamic", "multi-robot"]}
      },
      {
        id: "l-rs1-10", courseId: "rs-1", title: "Performance Optimization", 
        requireRobot: false, 
        duration: 4200, content: "Optimize simulation performance", 
        contentType: "programming", orderNumber: 10, 
        solution: {techniques: ["level_of_detail", "multithreading", "gpu_acceleration"]}
      },
      {
        id: "l-rs1-11", courseId: "rs-1", title: "Final Project: Complete Simulation", 
        requireRobot: false, 
        duration: 7200, content: "Build complete robot simulation", 
        contentType: "programming", orderNumber: 11, 
        solution: {requirements: ["robot_model", "environment", "sensors", "controllers"]}
      }
    ]
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