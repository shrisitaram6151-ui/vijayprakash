import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";

// Consultation services offered by the astrologer
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  titleHi: text("title_hi").notNull(),
  titleEn: text("title_en").notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 16 }).notNull().default("✨"),
  price: integer("price").notNull().default(299),
  durationMin: integer("duration_min").notNull().default(20),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Bookings / consultation requests with payment tracking
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id", { length: 64 }).notNull().unique(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: text("email"),
  serviceSlug: varchar("service_slug", { length: 120 }).notNull(),
  serviceTitle: text("service_title").notNull(),
  amount: integer("amount").notNull(),
  consultType: varchar("consult_type", { length: 20 }).notNull().default("call"), // call | whatsapp | video
  preferredDate: varchar("preferred_date", { length: 20 }),
  preferredTime: varchar("preferred_time", { length: 20 }),
  birthDate: varchar("birth_date", { length: 20 }),
  birthTime: varchar("birth_time", { length: 20 }),
  birthPlace: text("birth_place"),
  question: text("question"),
  paymentStatus: varchar("payment_status", { length: 20 })
    .notNull()
    .default("pending"), // pending | paid | failed
  bookingStatus: varchar("booking_status", { length: 20 })
    .notNull()
    .default("new"), // new | confirmed | completed | cancelled
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Callback / contact requests (free enquiries)
export const callbacks = pgTable("callbacks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  message: text("message"),
  handled: boolean("handled").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Client testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  message: text("message").notNull(),
  rating: integer("rating").notNull().default(5),
  approved: boolean("approved").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Service = typeof services.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Callback = typeof callbacks.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
