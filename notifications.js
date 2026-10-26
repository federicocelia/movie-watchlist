/**
 * Display temporary notifications to the user.
 *
 * Types:
 * - success
 * - warning
 * - error
 */
export function showNotification(message, type = "success") {
  // Remove any existing notification
  const existingNotification = document.querySelector(".notification");

  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");

  notification.classList.add("notification", `notification-${type}`);

  notification.textContent = message;

  document.body.append(notification);

  // Trigger animation
  requestAnimationFrame(() => {
    notification.classList.add("show");
  });

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");

    notification.addEventListener(
      "transitionend",
      () => notification.remove(),
      { once: true },
    );
  }, 3000);
}
