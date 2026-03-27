using CourseMate.Contracts.DTOs.Admins;
using MediatR;

namespace CourseMate.Contracts.DTOs.Instructors;

public class GetInstructorDashboardDataQuery : IRequest<DashboardDto>;
