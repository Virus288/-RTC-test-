# Diagrams - data flow

This file represents simplified flow of data, from user sending a message, to user receiving feedback.

Last update: 18.05.2025

```text
 ┌──────────────────┐                              
 │User sends request│                              
 └─────────┬────────┘                              
  ┌────────▽───────┐                               
  │Express received│                               
  │message         │                               
  └────────┬───────┘                               
┌──────────▽──────────┐                            
│Express moves message│                            
│to controller        │                            
└──────────┬──────────┘                            
  ┌────────▽────────┐                              
  │Controller       │                              
  │validates message│                              
  └────────┬────────┘                              
    _______▽________     ┌────────────────────────┐
   ╱                ╲    │Run logic action related│
  ╱ Is message valid ╲___│to message content      │
  ╲                  ╱yes└────────────┬───────────┘
   ╲________________╱       ┌─────────▽────────┐   
           │no              │Send back response│   
 ┌─────────▽────────┐       └──────────────────┘   
 │Send back -       │                              
 │Request is invalid│                              
 └──────────────────┘                              
```

<details>
  <summary>Raw diagram</summary>

"User sends request"
  "Express received message"
  "Express moves message to controller"
  "Controller validates message"

  if ("Is message valid") { 
      "Run logic action related to message content"
      return "Send back response"
  } else {
    return "Send back - Request is invalid"
  }

  Diagram made using Diagon 
</details>
