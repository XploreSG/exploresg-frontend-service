Absolutely, Sree — here’s a concise, structured note you can share with the other Copilot or teammates in your workspace. It outlines your current plan for building a multi-API developer portal using Swagger UI, integrated with your existing stack:

---

## 🧭 Capstone Dev Portal Plan: `dev.xplore.town`

### 🎯 Goal
Create a clean, branded developer portal at `dev.xplore.town` that hosts Swagger-based API documentation for multiple microservices (`auth`, `booking`, `fleet`, etc.), with dropdown navigation and CI-integrated updates.

---

### 🛠️ Stack Overview

| Component         | Role                                 |
|------------------|--------------------------------------|
| **Swagger UI**    | Renders OpenAPI specs with dropdown |
| **Spring Boot**   | Backend services exposing `/v3/api-docs` |
| **ArgoCD**        | GitOps sync for portal deployment   |
| **PLG Stack**     | Observability (Prometheus, Loki, Grafana) |
| **Ingress + TLS** | Routes traffic to `dev.xplore.town` with HTTPS |

---

### 📦 File Structure

```
swagger-ui/
├── index.html         # Custom Swagger UI with urls array
├── auth.json          # Exported OpenAPI spec
├── booking.json
├── fleet.json
```

---

### 🔧 Setup Steps

1. **Export OpenAPI specs** from each Spring Boot service:
   ```
   curl http://<service-host>/v3/api-docs -o booking.json
   ```

2. **Customize `index.html`** with Swagger UI `urls` array:
   ```js
   SwaggerUIBundle({
     urls: [
       { url: "auth.json", name: "Auth API" },
       { url: "booking.json", name: "Booking API" },
       { url: "fleet.json", name: "Fleet API" }
     ],
     dom_id: '#swagger-ui',
     layout: "StandaloneLayout"
   });
   ```

3. **Serve as static site** via NGINX or Helm chart in Kubernetes

4. **Ingress + TLS** for `dev.xplore.town` using cert-manager

5. **CI/CD pipeline** to auto-export specs and redeploy portal on push

---

### 🧪 Bonus Ideas

- Add Grafana panel to visualize API health and usage
- Include Redoc or GraphQL Playground as alternate views
- Add onboarding docs or markdown pages for each service
- Use GitHub Actions to lint specs and validate schema

---

Let me know if you want this turned into a markdown README or a Confluence page draft. I can also scaffold the K8s manifests and CI pipeline if you’re ready to delegate.
