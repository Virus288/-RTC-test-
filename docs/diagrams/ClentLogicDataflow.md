# Diagrams - data flow

This file represents simplified dataflow of client logic interface. 

Last update: 20.05.2025

Client logic 

```text
  ┌────────────────────┐                   
  │Controller          │                   
  │initializes interval│                   
  └──────────┬─────────┘                   
  ┌──────────▽──────────┐                  
  │Interval fetches data│                  
  └──────────┬──────────┘                  
┌────────────▽────────────┐                
│Controller pushes        │                
│simulations to controller│                
└────────────┬────────────┘                
       ______▽______     ┌────────────────┐
      ╱             ╲    │Controller      │
     ╱ Controller    ╲___│fetches mappings│
     ╲ returns false ╱yes└────────┬───────┘
      ╲_____________╱             │        
             │no                  │        
       ┌─────▽────┐               │        
       │Do nothing│               │        
       └─────┬────┘               │        
             └─────┬──────────────┘        
          ┌────────▽───────┐               
          │Wait for        │               
          │interval restart│               
          └────────────────┘               
```

<details>
  <summary>Raw diagram</summary>

  "Controller initializes interval"
  "Interval fetches data"
  "Controller pushes simulations to controller"

  if ("Controller returns false") { 
    "Controller fetches mappings"
  } else {
    "Do nothing"
  }

  "Wait for interval restart"

  Diagram made using Diagon 
</details>

Client status

```text
┌───────────────────┐                              
│Controller receives│                              
│simulation         │                              
└─────────┬─────────┘                              
   _______▽_______     ┌───────────────────┐       
  ╱               ╲    │Save previous state│       
 ╱ Did data come   ╲___│in the database    │       
 ╲ for 10'nth time ╱yes└─────────┬─────────┘       
  ╲_______________╱              │                 
          │no                    │                 
    ┌─────▽────┐                 │                 
    │Do nothing│                 │                 
    └─────┬────┘                 │                 
          └─────┬────────────────┘                 
       ┌────────▽───────┐                          
       │Controller tries│                          
       │to decode it    │                          
       └────────┬───────┘                          
        ________▽_________      ┌─────────────┐    
       ╱                  ╲     │Simulation is│    
      ╱ Are mappings valid ╲____│being decoded│    
      ╲                    ╱yes └──────┬──────┘    
       ╲__________________╱            │           
                │no                    │           
       ┌────────▽───────┐              │           
       │Save simulations│              │           
       │for next run    │              │           
       └────────┬───────┘              │           
 ┌──────────────▽──────────────┐       │           
 │Return false to controller to│       │           
 │force it to download mappings│       │           
 └─────────────────────────────┘       │           
                           ┌───────────▽──────────┐
                           │Compare changes       │
                           │between previous state│
                           └───────────┬──────────┘
                            ┌──────────▽─────────┐ 
                            │Validate if any     │ 
                            │simulations finished│ 
                            └──────────┬─────────┘ 
                              ┌────────▽────────┐  
                              │Save data locally│  
                              └─────────────────┘  
```

<details>
  <summary>Raw diagram</summary>

  "Controller receives simulation"

  if ("Did data come for 10'nth time") { 
    "Save previous state in the database"
  } else {
    "Do nothing"
  }

  "Controller tries to decode it"

  if ("Are mappings valid") { 
    "Simulation is being decoded"
  } else {
    "Save simulations for next run"
    return "Return false to controller to force it to download mappings"
  }

  "Compare changes between previous state"
  "Validate if any simulations finished"
  "Save data locally"

  Diagram made using Diagon 
</details>
