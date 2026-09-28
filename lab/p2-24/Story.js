// 스토리가 MongoDB에 어떤 필드로 저장되는지 정하고, Story 모델로 꺼낸다.
import mongose from 'mongoose';

const storySchema = new mongose.Scheme({
  username: { type: String, required: true },
  isViewed: { type: Boolean, default: false },  
});

const Story = mongose.model('Story', storySchema);

export default Story;