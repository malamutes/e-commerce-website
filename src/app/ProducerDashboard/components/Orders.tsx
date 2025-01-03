export default function Orders() {
    return <>
        Orders

        //ideas are list all orders here in total,
        for producer and their statuses,
        prolly split it into different tabs
        like completed, shipped,
        Pending: Orders that have been received but not yet processed or confirmed.
        Processing: Orders that are being prepared or are in the process of being fulfilled (e.g., picking and packing).
        Canceled: Orders that were canceled either by the customer or the producer.
        Refunded: Orders that have been refunded after payment was made.
        On Hold: Orders that are temporarily paused, possibly due to stock issues, payment verification, or customer requests.
        Failed: Orders that failed during payment or other processes (e.g., payment declined).
        Delivered: Orders that have been delivered to the customer.
        Awaiting Payment: Orders that are pending payment confirmation.
        In Transit: Orders that are currently being shipped and are in transit to the customer.
        Returned: Orders that the customer has returned after receiving them.
    </>
}