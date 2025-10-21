# Deployment Strategies Comparison

Quick reference for understanding different deployment strategies available with Argo Rollouts.

## Strategy Comparison Table

| Strategy | Risk Level | Downtime | Rollback Speed | Complexity | Best For |
|----------|-----------|----------|----------------|------------|----------|
| **RollingUpdate** (Current) | Medium | None | Medium | Low | Basic needs |
| **Blue-Green** | Low | None | Instant | Medium | Critical services |
| **Canary** | Very Low | None | Fast | Medium | Gradual rollout |
| **Canary + Analysis** | Very Low | None | Automatic | High | Production |

## Visual Comparison

### Current: RollingUpdate
```
Before:  [v1] [v1] [v1]
During:  [v1] [v1] [v2]  ← Gradually replace
After:   [v2] [v2] [v2]
```
- ✅ Simple
- ⚠️ Partial rollout issues affect users
- ⚠️ Manual rollback needed

### Blue-Green
```
Before:  [Blue v1] [Blue v1]  ← 100% traffic
Deploy:  [Blue v1] [Blue v1]  [Green v2] [Green v2]  ← Testing
Switch:  [Blue v1] [Blue v1]  [Green v2] [Green v2]  ← 100% traffic
```
- ✅ Instant cutover
- ✅ Instant rollback
- ✅ No partial state
- ⚠️ Doubles resources temporarily

### Canary
```
Step 1:  [v1] [v1] [v1] [v2]  ← 10% traffic to v2
Step 2:  [v1] [v1] [v2] [v2]  ← 25% traffic to v2
Step 3:  [v1] [v2] [v2] [v2]  ← 50% traffic to v2
Step 4:  [v2] [v2] [v2] [v2]  ← 100% traffic to v2
```
- ✅ Gradual rollout
- ✅ Limited blast radius
- ✅ Real user validation
- ⚠️ Takes longer

### Canary with Analysis
```
Step 1:  [v1] [v1] [v2]  ← 10% traffic
         └─> Run Analysis (Success Rate, Latency)
         
Step 2:  [v1] [v2] [v2]  ← 50% traffic (if analysis passed)
         └─> Run Analysis
         
Step 3:  [v2] [v2] [v2]  ← 100% traffic (if analysis passed)
         
If analysis fails: AUTOMATIC ROLLBACK
```
- ✅ Fully automated
- ✅ Metrics-driven decisions
- ✅ Auto-rollback on issues
- ⚠️ Requires monitoring (Prometheus)

## Service-Specific Recommendations

### Auth Service
**Recommended: Blue-Green**
```yaml
strategy:
  blueGreen:
    autoPromotionEnabled: false  # Manual approval
```
**Why:**
- Critical service
- Needs instant rollback
- Zero tolerance for auth failures
- Manual approval before production

### Payment Service
**Recommended: Blue-Green**
```yaml
strategy:
  blueGreen:
    autoPromotionEnabled: false  # Manual approval
```
**Why:**
- Critical for business
- Compliance requirements
- Manual verification needed
- Instant rollback capability

### Fleet Service
**Recommended: Canary with Analysis**
```yaml
strategy:
  canary:
    steps:
    - setWeight: 20
    - analysis: {...}  # Check success rate
    - setWeight: 50
```
**Why:**
- Less critical than auth/payment
- Good for testing analysis
- Real user feedback valuable
- Automated decision making

### Frontend Service
**Recommended: Simple Canary**
```yaml
strategy:
  canary:
    steps:
    - setWeight: 10
    - pause: {duration: 2m}
    - setWeight: 50
    - pause: {duration: 2m}
```
**Why:**
- Low risk
- Quick to rollback
- Good starting point
- Easy to understand

## Metrics for Analysis

### Success Rate (All Services)
```yaml
successCondition: result >= 0.95  # 95% success rate
query: |
  sum(rate(http_requests_total{status=~"2.."}[5m])) /
  sum(rate(http_requests_total[5m]))
```

### Latency (User-Facing Services)
```yaml
successCondition: result < 500  # Under 500ms
query: |
  histogram_quantile(0.95,
    rate(http_request_duration_seconds_bucket[5m])
  ) * 1000
```

### Error Rate (Critical Services)
```yaml
successCondition: result < 0.01  # Less than 1% errors
query: |
  sum(rate(http_requests_total{status=~"5.."}[5m])) /
  sum(rate(http_requests_total[5m]))
```

### Custom Business Metrics
```yaml
# Example: Login success rate for auth service
successCondition: result >= 0.99  # 99% login success
query: |
  sum(rate(login_attempts_total{result="success"}[5m])) /
  sum(rate(login_attempts_total[5m]))
```

## Migration Path

### Phase 1: Start Simple
1. **Frontend** → Simple Canary (no analysis)
2. Learn the workflow
3. Gain confidence

### Phase 2: Add Intelligence
1. **Fleet Service** → Canary with Analysis
2. Set up Prometheus queries
3. Test auto-rollback

### Phase 3: Secure Critical
1. **Auth Service** → Blue-Green (manual)
2. **Payment Service** → Blue-Green (manual)
3. Production-ready

## Decision Matrix

| Your Situation | Recommended Approach |
|---------------|---------------------|
| 🎓 **Learning K8s** | Stick with RollingUpdate for now |
| 🚀 **Deploying to cloud** | Start with simple Canary |
| 📊 **Have Prometheus** | Use Canary with Analysis |
| 💰 **Critical services** | Use Blue-Green |
| 👥 **Team collaboration** | Use Rollouts for safer deploys |
| 🏠 **Local only** | RollingUpdate is fine |

## Cost-Benefit Analysis

### Benefits
- ✅ **Reduced risk**: Limited blast radius
- ✅ **Faster recovery**: Quick rollback
- ✅ **Better confidence**: Real metrics validation
- ✅ **Learning**: Industry-standard practices
- ✅ **Portfolio**: Impressive for interviews

### Costs
- ⚠️ **Time**: 4-8 hours initial setup
- ⚠️ **Complexity**: More concepts to learn
- ⚠️ **Resources**: Additional controller
- ⚠️ **Maintenance**: More to monitor

## Quick Commands Reference

### Watch Rollout
```bash
kubectl argo rollouts get rollout <name> -n exploresg --watch
```

### Promote Canary
```bash
kubectl argo rollouts promote <name> -n exploresg
```

### Abort Rollout
```bash
kubectl argo rollouts abort <name> -n exploresg
```

### Undo/Rollback
```bash
kubectl argo rollouts undo <name> -n exploresg
```

### View History
```bash
kubectl argo rollouts history <name> -n exploresg
```

### View Analysis
```bash
kubectl get analysisrun -n exploresg
kubectl describe analysisrun <run-name> -n exploresg
```

## Real-World Scenario

### Scenario: Auth Service Update Gone Wrong

**Without Rollouts (Current):**
```
1. Deploy v1.2.7
2. RollingUpdate starts
3. New pods crash due to bug
4. Some users can't login (50% affected)
5. Panic! Manual rollback needed
6. Edit deployment, change image
7. Wait for rollout
8. 5-10 minutes of partial outage
```

**With Blue-Green Rollout:**
```
1. Deploy v1.2.7 (Green)
2. Green pods start, tested via preview service
3. Notice crash in preview
4. Don't promote! Keep Blue (v1.2.6) serving traffic
5. Fix bug, deploy v1.2.7.1
6. Test again, verify it works
7. Promote to production
8. Zero user impact!
```

**With Canary + Analysis:**
```
1. Deploy v1.2.7
2. 10% of users get new version
3. Analysis detects increased error rate
4. Automatic rollback triggered
5. All users back to v1.2.6
6. Total impact: 10% of users for ~2 minutes
```

## When NOT to Use Rollouts

1. **Database migrations** - Use separate migration jobs
2. **ConfigMap changes** - Rollouts don't track these
3. **Secret updates** - Need pod restart
4. **Init containers** - Limited rollout support

For these, use traditional Deployments or specialized tools.

## Conclusion

| If you want... | Use... |
|----------------|--------|
| **Simplicity** | RollingUpdate (current) |
| **Safety** | Blue-Green |
| **Gradual rollout** | Canary |
| **Full automation** | Canary + Analysis |
| **Best of both** | Blue-Green for critical, Canary for others |

**Bottom line**: Argo Rollouts gives you **options**. You can choose the right strategy for each service based on its criticality and your comfort level.
