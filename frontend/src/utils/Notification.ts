 export const notify=async function showNotification(title:string|null,body:string|null) {
  if (Notification.permission !== "granted") return;

  new Notification("District", {
    body: `"${title}" ${body}`,
    icon: "/icon-192.png",
  });
}

