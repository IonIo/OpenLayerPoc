using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Map.BackEnd.AlarmHub
{
    public class GsecMapAlarmHub : Hub
    {
        public async Task Send(string message)
        {
            await this.Clients.All.SendAsync("Send", message);
        }
    }
}
