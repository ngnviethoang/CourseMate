using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class GetDashboardDataQuery : IRequest<DashboardDto>;
