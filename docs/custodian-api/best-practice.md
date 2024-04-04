# Best Practices Process Templates

![Local Image](./template.jpg)

The aim of a template is to encapsulate a single business use-case in a self-deployable unit. It should be easy to understand, clear in its intention, and simple to deploy. Below are some guidelines on how you would achieve this. These guidelines do not state that you should avoid certain things, but rather aim to provide context and explain some of the trade-offs of your design decisions.


### Simplicity

`Always aim for simplicity over any other motivation.`

Simplicity in templates refers to how easily colleagues can deploy, modify, comprehend, and upkeep processes. 
Your process behavior should consistently yield predefined outcomes.

### Low Ceremony

`Ready to use`

Processes often rely on predefined, hardcoded, or static data. Ensure these are minimized, and thorough documentation is provided to highlight any required setup data, such as types, categories, locations, etc.

### Abstraction and Decoupling

`Less moving parts`

Keep to a single stored procedure per prescript and try to avoid further decoupling.

Decoupling and Abstraction often used for re-use can increase complexity, ensure the re-use value is justified.

### Explicit over Generic

`Be Explicit`

While Generic (multipurpose) processes have their value, simplicity is often compromised in their favor. 
However, it's preferable to develop Explicit (single-use) processes for the sake of simplicity.


-----




Granite processes (process flow) are designed to be versatile and generic tool, incorporating pre-scripts, web templates, lookup data, and more.
The task of both technical and business consultants is to utilize this tool to **create clear and specific processes**.
The goal isn't to create more generic processes, but rather to focus on refining the business domain, specifically in warehousing.

