using CourseMate.Contracts.DTOs.Commons;
using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class GetDashboardDataQuery : IRequest<DashboardDto>;