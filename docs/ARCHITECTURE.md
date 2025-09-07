# AWS Chime SDK Architecture

## Component Strategy

### Production Meeting Flow

```
1. Device Setup (Standalone) → 2. Join Meeting (Component Library)
```

### Component Library Usage (Real Meetings)
- **When**: Active meeting sessions
- **Components**: AudioInputControl, VideoInputControl, VideoTileGrid, ControlBar
- **Benefits**: Full SDK integration, participant management, production features

### Standalone Usage (Pre-meeting)
- **When**: Device testing, setup, diagnostics
- **Components**: StandaloneAudioControl, StandaloneVideoPreview, StandaloneScreenShare
- **Benefits**: Immediate functionality, no meeting session required

## Deployment Strategy

### Development/Testing
- Enhanced-devices page: Demonstrates both approaches
- Compare functionality side-by-side

### Production
- Setup flow: Standalone components for device testing
- Meeting flow: Component Library for actual meetings
- Hybrid approach: Best of both worlds

## Migration Path

1. **Phase 1**: Use standalone for immediate functionality
2. **Phase 2**: Integrate Component Library for production meetings
3. **Phase 3**: Optimize based on real user feedback
