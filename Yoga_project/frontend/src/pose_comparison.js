export function comparePoses(pose1, pose2, keypointThreshold, angleThreshold) {
    const matchingKeypoints = [];
    const matchingSegments = [];
  
    // Calculate matching keypoints
    for (let i = 0; i < pose1.keypoints.length; i++) {
      const keypoint1 = pose1.keypoints[i].position;
      const keypoint2 = pose2.keypoints[i].position;
      const distance = Math.sqrt(
        Math.pow(keypoint1.x - keypoint2.x, 2) +
        Math.pow(keypoint1.y - keypoint2.y, 2)
      );
      matchingKeypoints[i] = distance <= keypointThreshold;
    }
  
    // Calculate matching segments
    const connectedKeypoints = [
      [5, 6], [5, 7], [6, 8], [7, 9], [8, 10], [11, 12], [11, 13], [12, 14], [13, 15], [14, 16]
    ];
  
    for (let i = 0; i < connectedKeypoints.length; i++) {
      const [index1, index2] = connectedKeypoints[i];
      if (matchingKeypoints[index1] && matchingKeypoints[index2]) {
        const angle1 = calculateAngle(pose1.keypoints, index1, index2);
        const angle2 = calculateAngle(pose2.keypoints, index1, index2);
        const angleDifference = Math.abs(angle1 - angle2);
        matchingSegments[i] = angleDifference <= angleThreshold;
      } else {
        matchingSegments[i] = false;
      }
    }
  
    return { matchingKeypoints, matchingSegments };
  }
  
  function calculateAngle(keypoints, index1, index2) {
    const point1 = keypoints[index1].position;
    const point2 = keypoints[index2].position;
    const angle = Math.atan2(point2.y - point1.y, point2.x - point1.x);
    return angle;
  }