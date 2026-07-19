# 🌍 Atmoscan - Smart Air Pollution Monitoring & Purification System

<div align="center">

![Atmoscan Banner](https://img.shields.io/badge/Atmoscan-Air%20Quality%20Monitor-brightgreen?style=for-the-badge&logo=air&logoColor=white)

**IoT-Based Real-time Air Quality Monitoring and Smart Purification System**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![ESP32](https://img.shields.io/badge/ESP32-Enabled-red?style=flat&logo=espressif)](https://www.espressif.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

</div>

---
Live Demo:https://atmoscan-1ly5.vercel.app/
## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Hardware Components](#-hardware-components)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Dashboard Features](#-dashboard-features)
- [Working Principle](#-working-principle)
- [Screenshots](#-screenshots)
- [Live Demo](#-live-demo)
- [Future Scope](#-future-scope)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🎯 Project Overview

**Atmoscan** is an **IoT-based Smart Air Pollution Monitoring and Purification System** that continuously monitors indoor air quality in real-time and automatically activates the purification mechanism when pollution exceeds safe limits. The system combines hardware sensors (ESP32, MQ135, DHT11) with a professional web dashboard built with Next.js.

### Key Highlights

| Feature | Description |
|---------|-------------|
| ✅ **Real-time Monitoring** | Updates every 3 seconds |
| ✅ **Automatic Purification** | Fan activates when AQI > 100 |
| ✅ **Professional Dashboard** | Beautiful, responsive web interface |
| ✅ **Portable Design** | Battery-powered for any location |
| ✅ **Low Cost** | Affordable for homes and offices |
| ✅ **Notifications** | Instant alerts for hazardous conditions |
| ✅ **Data Persistence** | MongoDB Atlas for historical data |

---

## ✨ Features

### Hardware Features

| Feature | Description |
|---------|-------------|
| **ESP32 Microcontroller** | Main processing unit with Wi-Fi connectivity |
| **MQ135 Gas Sensor** | Detects CO₂, smoke, ammonia, benzene |
| **DHT11 Sensor** | Measures temperature and humidity |
| **OLED Display** | Shows real-time data locally |
| **Relay Module** | Controls fan/purifier automatically |
| **LED Indicators** | Red (Hazardous), Yellow (Moderate), Green (Good) |
| **Buzzer Alert** | Sound alarm for dangerous conditions |
| **Battery Powered** | Portable operation with 18650 batteries |

### Software Features

| Feature | Description |
|---------|-------------|
| **Real-time Dashboard** | Live AQI, CO₂, CO, Temperature, Humidity |
| **24-Hour Trend Chart** | Historical data visualization |
| **Purifier Status** | Fan speed, relay status, filter life |
| **ESP32 Connection Status** | Live/Offline indicator |
| **Notification System** | Alerts for AQI changes |
| **Dark/Light Theme** | User preference toggle |
| **Analytics View** | Average, Max, Min AQI statistics |
| **Data Export** | Export data as JSON |
| **MongoDB Integration** | Permanent data storage |
| **Responsive Design** | Works on desktop, tablet, mobile |

---


---

## 🔧 Hardware Components

| # | Component | Quantity | Purpose |
|---|-----------|----------|---------|
| 1 | ESP32 (Type-C) | 1 | Main microcontroller |
| 2 | MQ135 Gas Sensor | 1 | CO₂, smoke, gas detection |
| 3 | DHT11 Sensor | 1 | Temperature & Humidity |
| 4 | 1.3" OLED Display | 1 | Local data display |
| 5 | Relay Module (5V) | 1 | Fan/Purifier control |
| 6 | DC Fan + Turbine | 1 | Air purification |
| 7 | Buzzer Module | 1 | Audio alert |
| 8 | LED (Red, Yellow, Green) | 3 | Status indicators |
| 9 | 18650 Battery (3.7V) | 2 | Portable power |
| 10 | TP4056 Module | 1 | Battery charging |
| 11 | Buck Converter | 1 | Voltage regulation |
| 12 | Power Switch | 1 | ON/OFF control |
| 13 | Breadboard + Veroboard | 1 | Circuit connection |
| 14 | Jumper Wires | Set | Connections |
| 15 | Resistors (220Ω, 10kΩ) | 10 | LED & Sensor connections |


---

## 💻 Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.0 | React framework with SSR |
| **React** | 18.2.0 | UI components |
| **TypeScript** | 5.0+ | Type-safe code |
| **Framer Motion** | 10.16.4 | Animations & transitions |
| **Lucide React** | 0.292.0 | Professional icons |
| **CSS-in-JS** | - | Component styling |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 14.2.0 | Serverless API endpoints |
| **Node.js** | 18+ | JavaScript runtime |
| **TypeScript** | 5.0+ | Type-safe backend |
| **MongoDB Atlas** | - | Cloud database |

### Hardware
| Technology | Version | Purpose |
|------------|---------|---------|
| **Arduino IDE** | 2.0+ | ESP32 programming |
| **ESP32** | - | Microcontroller |
| **MQ135** | - | Gas sensor |
| **DHT11** | - | Temp/Humidity sensor |

### Communication
| Protocol | Purpose |
|----------|---------|
| **HTTP/HTTPS** | REST API communication |
| **Serial (USB)** | ESP32 to Computer data transfer |
| **JSON** | Data exchange format |

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Arduino IDE (for ESP32)
- Git
- MongoDB Atlas Account (optional, for cloud storage)

## 👥 Contributors

| Name | ID | Role |
|------|-----|------|
| **Habiba Sultana Bristy** | 1118003 | Team Lead & Frontend,Backend |
| **Saima Rahman Rabaya** | 1118012 | Documentation  |
| **Iffat Ara Nowshin** | 1118021 |  Hardware & Testing|

### Supervisor

**Syed Shakil Mahmud**  
Lecturer, Department of CSE  
Bangladesh Army International University of Science and Technology

---
## 🙏 Acknowledgements

- Bangladesh Army International University of Science and Technology
- Department of Computer Science and Engineering
- Our Supervisor, **Syed Shakil Mahmud**, for his guidance and support

---

<div align="center">

**Made with ❤️ by Team Atmoscan**

*“Clean Air, Healthy Life”*

</div>