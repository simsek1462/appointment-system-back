# Hospital Appointment System

![NestJS](https://img.shields.io/badge/NestJS-v10-red?logo=nestjs)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue?logo=mysql)
![TypeORM](https://img.shields.io/badge/TypeORM-ORM-orange)
![License](https://img.shields.io/badge/license-MIT-green)

> Full-stack ready backend for hospital appointment management built with **NestJS**, **TypeORM**, and **MySQL**.  
> Patients can view available time slots, book appointments, and manage them easily.

---

## Overview

This project is a backend API for managing hospitals, clinics, doctors, users, and appointments.  
It supports full CRUD operations and includes **automatic slot generation** for available appointment times.

---

## Features

**Hospital Management** — Create, list, update, delete hospitals  
**Clinic Management** — Link clinics to hospitals  
**Doctor Management** — Assign doctors to hospitals & clinics  
**User Management** — Register/login, secure password hashing with bcrypt  
**Appointment System**
- View available time slots  
- Create new appointment  
- Update or cancel appointment  
- Prevent double booking  
**JWT Authentication**

---

## Tech Stack

| Technology | Purpose |
|-------------|----------|
| **NestJS** | Backend framework |
| **TypeORM** | ORM & Database abstraction |
| **MySQL** | Relational database |
| **Class-Validator / Transformer** | Input validation |
| **bcrypt** | Password hashing |
| **dotenv / ConfigModule** | Environment configuration |

---

## Installation

### Clone the repository
```bash
git clone https://github.com/<your-username>/hospital-appointment-system.git
cd hospital-appointment-system
