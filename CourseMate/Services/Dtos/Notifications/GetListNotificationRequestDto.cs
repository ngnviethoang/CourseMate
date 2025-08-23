namespace CourseMate.Services.Dtos.Notifications;

public class GetListNotificationRequestDto : GetListRequestDto
{
    public Guid? ReceiverUserId { get; set; }
}