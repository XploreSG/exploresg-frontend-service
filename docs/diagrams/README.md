# ExploreSingapore UML Diagrams

This directory contains all PlantUML diagram source files for the ExploreSingapore application documentation.

## 📁 Diagram Files

| File                                | Diagram Type  | Description                                  |
| ----------------------------------- | ------------- | -------------------------------------------- |
| `01-physical-architecture.puml`     | Deployment    | Complete infrastructure and network topology |
| `02-activity-booking-flow.puml`     | Activity      | End-to-end booking process workflow          |
| `03-aws-deployment.puml`            | Deployment    | AWS cloud architecture with services         |
| `04-communication-diagram.puml`     | Communication | Google OAuth authentication flow             |
| `05-entity-relationship.puml`       | ERD           | Database schema and relationships            |
| `06-react-component-hierarchy.puml` | Component     | React component tree structure               |
| `07-data-flow.puml`                 | DFD           | Data flow between system components          |
| `08-timing-diagram.puml`            | Timing        | Real-time GPS tracking sequence              |

## 🛠️ How to Use

### Method 1: VS Code with PlantUML Extension

1. **Install Extension:**

   ```
   ext install plantuml
   ```

2. **Install Graphviz:**
   - Windows: `choco install graphviz`
   - Mac: `brew install graphviz`
   - Linux: `sudo apt install graphviz`

3. **Preview Diagram:**
   - Open any `.puml` file
   - Press `Alt+D` (Windows/Linux) or `Option+D` (Mac)
   - Or right-click → "Preview Current Diagram"

4. **Export Diagrams:**
   - Right-click on `.puml` file
   - Select "Export Current Diagram"
   - Choose format: PNG, SVG, PDF

### Method 2: Online PlantUML Editor

1. Visit: https://www.plantuml.com/plantuml/uml/
2. Copy the content of any `.puml` file
3. Paste into the online editor
4. View and download the rendered diagram

### Method 3: Command Line (Node.js)

```bash
# Install PlantUML CLI
npm install -g node-plantuml

# Generate PNG for single file
plantuml 01-physical-architecture.puml

# Generate all diagrams as PNG
plantuml *.puml -tpng

# Generate as SVG (vector, scalable)
plantuml *.puml -tsvg

# Generate with custom output directory
plantuml *.puml -tpng -o ../rendered/
```

### Method 4: Docker

```bash
# Pull PlantUML Docker image
docker pull plantuml/plantuml

# Generate PNG from current directory
docker run --rm -v ${PWD}:/data plantuml/plantuml -tpng /data/*.puml

# Generate SVG
docker run --rm -v ${PWD}:/data plantuml/plantuml -tsvg /data/*.puml
```

### Method 5: IntelliJ IDEA / WebStorm

1. **Install Plugin:**
   - Settings → Plugins → Search "PlantUML"
   - Install "PlantUML Integration"

2. **Preview:**
   - Open any `.puml` file
   - Preview pane appears automatically
   - Right-click → "Export" for PNG/SVG

### Method 6: Automated CI/CD

Add to `.github/workflows/diagrams.yml`:

```yaml
name: Generate Diagrams

on:
  push:
    paths:
      - "docs/diagrams/*.puml"

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: "temurin"
          java-version: "17"

      - name: Install PlantUML
        run: |
          wget https://github.com/plantuml/plantuml/releases/download/v1.2023.12/plantuml-1.2023.12.jar
          sudo mv plantuml-*.jar /usr/local/bin/plantuml.jar

      - name: Generate Diagrams
        run: |
          java -jar /usr/local/bin/plantuml.jar -tpng docs/diagrams/*.puml -o ../rendered/

      - name: Commit Generated Diagrams
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add docs/rendered/*.png
          git commit -m "Generated diagrams" || echo "No changes"
          git push
```

## 📊 Diagram Descriptions

### 1. Physical Architecture (`01-physical-architecture.puml`)

Shows the complete deployment infrastructure including:

- Client tier (browsers)
- CDN/Load balancer
- Docker containers (Frontend & Backend)
- Databases (PostgreSQL, MongoDB, Redis)
- External services (Google, Mapbox, Weather, Eagle IoT)
- Monitoring and logging

### 2. Activity Diagram - Booking Flow (`02-activity-booking-flow.puml`)

Detailed workflow of the car rental booking process:

- Vehicle browsing and filtering
- Add-ons selection
- Driver details collection
- Payment processing
- Booking confirmation
- Error handling and validations

### 3. AWS Deployment Architecture (`03-aws-deployment.puml`)

AWS-specific deployment showing:

- Route 53 DNS
- CloudFront CDN
- ALB (Application Load Balancer)
- ECS Fargate containers
- RDS PostgreSQL
- ElastiCache Redis
- DynamoDB
- CloudWatch monitoring
- VPC configuration

### 4. Communication Diagram (`04-communication-diagram.puml`)

Google OAuth authentication flow showing:

- User interaction sequence
- OAuth authorization
- Token generation
- Client-side storage
- State management

### 5. Entity Relationship Diagram (`05-entity-relationship.puml`)

Complete database schema including:

- User and roles
- Vehicles and operators
- Bookings and payments
- Driver details
- Fleet tracking
- GPS history
- Audit logs

### 6. React Component Hierarchy (`06-react-component-hierarchy.puml`)

React component tree structure:

- Context providers
- Page components
- Feature components
- Shared components
- Component relationships
- Props and data flow

### 7. Data Flow Diagram (`07-data-flow.puml`)

System-wide data flow:

- External entities (users)
- Processes (authentication, booking, fleet, payment)
- Data stores
- External systems
- Data transformations

### 8. Timing Diagram (`08-timing-diagram.puml`)

Real-time GPS tracking timeline:

- Vehicle GPS device states
- Eagle IoT processing
- WebSocket communication
- Frontend updates
- Map rendering
- 2-second update cycles

## 🎨 Customization

### Changing Colors

Edit the color scheme in any diagram:

```plantuml
skinparam component {
    BackgroundColor<<frontend>> LightBlue
    BackgroundColor<<backend>> LightGreen
}
```

### Adding Notes

```plantuml
note right of ComponentName
    Your note text here
    Can be multi-line
end note
```

### Changing Layout

```plantuml
' Top to bottom (default)
top to bottom direction

' Left to right
left to right direction
```

## 📦 Output Formats

PlantUML supports multiple output formats:

| Format | Extension | Use Case               |
| ------ | --------- | ---------------------- |
| PNG    | `.png`    | General documentation  |
| SVG    | `.svg`    | Web, scalable graphics |
| PDF    | `.pdf`    | Printable documents    |
| EPS    | `.eps`    | LaTeX documents        |
| TXT    | `.txt`    | ASCII art (basic)      |

## 🔗 Resources

- **PlantUML Official Site**: https://plantuml.com/
- **PlantUML Language Reference**: https://plantuml.com/guide
- **AWS PlantUML Icons**: https://github.com/awslabs/aws-icons-for-plantuml
- **C4 PlantUML**: https://github.com/plantuml-stdlib/C4-PlantUML
- **PlantUML Cheat Sheet**: https://ogom.github.io/draw_uml/plantuml/

## 🤝 Contributing

When adding new diagrams:

1. Use descriptive filenames with numbering: `##-diagram-name.puml`
2. Add comprehensive notes and legends
3. Use consistent color schemes
4. Include this README update
5. Test diagram generation before committing
6. Add entry to the main documentation

## 📝 Maintenance

### Keeping Diagrams Updated

When code changes affect architecture:

1. Update corresponding `.puml` files
2. Regenerate images
3. Commit both source and rendered diagrams
4. Update main documentation if needed

### Diagram Versioning

For major architecture changes:

1. Create dated copies: `01-physical-architecture-2025-10.puml`
2. Maintain current version as main file
3. Archive old versions in `archive/` subdirectory

## 🐛 Troubleshooting

### Common Issues

**Issue: "Cannot find Java"**

```bash
# Install Java
sudo apt install default-jre  # Linux
brew install java             # Mac
choco install openjdk         # Windows
```

**Issue: "Graphviz not found"**

```bash
# Install Graphviz
sudo apt install graphviz     # Linux
brew install graphviz         # Mac
choco install graphviz        # Windows
```

**Issue: "Syntax error in diagram"**

- Check for missing `@startuml` or `@enduml`
- Validate brackets and quotes
- Use online validator: https://www.plantuml.com/plantuml/

**Issue: "Diagram too complex"**

```plantuml
' Add at the top to increase memory
!pragma maxMessageSize 10000
```

## 📞 Support

For questions or issues:

- Check PlantUML documentation
- Open issue in project repository
- Contact development team

---

**Last Updated**: October 22, 2025  
**Maintained By**: ExploreSingapore Development Team
