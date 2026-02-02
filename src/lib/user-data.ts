import { prisma } from "./prisma";

export async function getUserExportData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: true,
      enrollments: {
        include: {
          course: {
            select: { title: true, type: true }
          }
        }
      },
      progress: {
        include: {
          lesson: {
            select: { title: true, moduleId: true }
          }
        }
      },
      quizAttempts: {
        include: {
          quiz: {
            select: { title: true }
          }
        }
      },
      orders: {
        include: {
          payments: true,
          items: {
            include: {
              course: {
                select: { title: true }
              }
            }
          }
        }
      },
      paymentLinks: {
        include: {
          course: {
            select: { title: true }
          }
        }
      },
      consentLogs: true,
      studentLessons: {
        include: {
          instructor: {
            include: {
              user: {
                select: { name: true }
              }
            }
          }
        }
      },
      instructorProfile: true,
      teacherProfile: true,
      documents: true,
      studentAssignments: {
        include: {
          instructor: {
            include: {
              user: {
                select: { name: true }
              }
            }
          }
        }
      }
    }
  });

  if (!user) return null;

  // Clean sensitive data before export
  const exportData = {
    profile: {
      id: user.id,
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      birthDate: user.birthDate,
      profession: user.profession,
      employerName: user.employerName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      addresses: user.addresses,
    },
    educational: {
      enrollments: user.enrollments,
      lessonProgress: user.progress,
      quizAttempts: user.quizAttempts,
    },
    financial: {
      orders: user.orders,
      paymentLinks: user.paymentLinks,
    },
    driving: {
      lessons: user.studentLessons,
      assignments: user.studentAssignments,
    },
    security_privacy: {
      consentLogs: user.consentLogs,
      badges: user.badges,
      onboardingStatus: user.onboardingStatus,
    },
    documents: user.documents,
    profiles: {
      instructor: user.instructorProfile,
      teacher: user.teacherProfile,
    }
  };

  return exportData;
}
