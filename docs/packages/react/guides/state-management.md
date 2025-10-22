---
sidebar_position: 2
title: State Management
description: Managing state with XHub Chat React
tags: [react, state, management]
---

# 🔄 State Management Guide

Learn how to manage state effectively with XHub Chat React.

## Automatic Re-rendering

Hooks automatically trigger re-renders when data changes:

```tsx
function ChatRoom({ roomId }: { roomId: string }) {
  const { events } = useTimeline(roomId);
  // ✅ Auto re-renders when new messages arrive
  
  return (
    <div>
      {events.map(event => (
        <Message key={event.getId()} event={event} />
      ))}
    </div>
  );
}
```

## Custom State

Combine with React state:

```tsx
function ChatRoom() {
  const rooms = useRooms();
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]?.roomId);
  const { events } = useTimeline(selectedRoom);
  
  return (
    <>
      <RoomList 
        rooms={rooms} 
        onSelect={setSelectedRoom} 
      />
      <Timeline events={events} />
    </>
  );
}
```

## Performance

Use React.memo for optimization:

```tsx
const Message = React.memo(({ event }) => (
  <div>{event.getContent().body}</div>
));
```

[Back to React Package](/docs/packages/react/)
