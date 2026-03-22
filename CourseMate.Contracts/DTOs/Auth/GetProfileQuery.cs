using MediatR;

namespace CourseMate.Contracts.DTOs.Auth;

public class GetProfileQuery : IRequest<ProfileDto>;