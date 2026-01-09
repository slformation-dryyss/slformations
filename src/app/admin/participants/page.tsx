import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ParticipantsClient } from "./ParticipantsClient";

export default async function AdminParticipantsPage() {
  await requireAdmin();
  
  // Fetch all users with their enrollments and payment links
  const users = await prisma.user.findMany({
    where: {
      role: "STUDENT"
    },
    include: {
      enrollments: {
        include: {
          course: {
            select: {
              title: true,
              price: true
            }
          }
        }
      },
      paymentLinks: {
        where: {
          status: "PENDING"
        },
        include: {
          course: {
            select: {
              title: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  
  // Fetch all courses for the payment link modal
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true
    },
    select: {
      id: true,
      title: true,
      price: true
    },
    orderBy: {
      title: "asc"
    }
  });
  
  return <ParticipantsClient users={users} courses={courses} />;
}

