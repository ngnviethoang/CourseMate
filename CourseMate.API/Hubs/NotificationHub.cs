using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace CourseMate.API.Hubs;

[Authorize]
public class NotificationHub : Hub;