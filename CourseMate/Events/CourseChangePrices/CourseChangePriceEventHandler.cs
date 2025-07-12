using CourseMate.Hubs;
using Microsoft.AspNetCore.SignalR;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus.Distributed;

namespace CourseMate.Events.CourseChangePrices;

public class CourseChangePriceEventHandler : IDistributedEventHandler<CourseChangePriceEto>, ITransientDependency
{
    private readonly IHubContext<CoursePriceHub> _hubContext;

    public CourseChangePriceEventHandler(IHubContext<CoursePriceHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task HandleEventAsync(CourseChangePriceEto eventData)
    {
        await _hubContext.Clients
            .Group(eventData.CourseId.ToString())
            .SendAsync("CoursePriceChanged", new
            {
                eventData.CourseId,
                eventData.OldPrice,
                eventData.NewPrice,
                eventData.ChangedAt
            });
    }
}