document.addEventListener('DOMContentLoaded', function() {
    if (typeof userService !== 'undefined') {
        userService.initStorage();
    }
    if (window.location.pathname.includes('items.html') && typeof itemService !== 'undefined') {
        itemService.initItems();
    }
});