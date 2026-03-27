using CourseMate.Contracts.DTOs.Commons;
using MediatR;

namespace CourseMate.Contracts.DTOs.Instructors;

public class GetInstructorDashboardDataQuery : IRequest<DashboardDto>;