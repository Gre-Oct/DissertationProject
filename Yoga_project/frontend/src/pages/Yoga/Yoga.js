import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import React, { useRef, useState, useEffect } from 'react'
import backend from '@tensorflow/tfjs-backend-webgl'
import Webcam from 'react-webcam'
import { count } from '../../utils/music'; 
 
import Instructions from '../../components/Instructions/Instructions';

import './Yoga.css'
 
import DropDown from '../../components/DropDown/DropDown';
import { poseImages } from '../../utils/pose_images';
import { POINTS, keypointConnections } from '../../utils/data';
import { drawPoint, drawSegment } from '../../utils/helper'



let skeletonColor = 'rgb(255,255,255)'
let poseList = [
  'Tree', 'Chair', 'Triangle'
]

let interval

// flag variable is used to help capture the time when AI just detect 
// the pose as correct(probability more than threshold)
let flag = false

// Counter used to move through the poses of a sequence
let sequenceStep = 0

function Yoga() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)


  const [startingTime, setStartingTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date(Date()).getTime())
  const [poseTime, setPoseTime] = useState(0)
  const [bestPerform, setBestPerform] = useState(0)
  const [currentPose, setCurrentPose] = useState('Tree')
  const [isStartPose, setIsStartPose] = useState(false)
  //sequences
  const [isSequence1, setIsStartSequence1] = useState(false)
  const [isSequence2, setIsStartSequence2] = useState(false)
  const [isSequence3, setIsStartSequence3] = useState(false)

  // Each pose in a sequence is a reference to the pose list
  // Note that the reference is interchangeable with strings such that output should be the same
  // Such as:
  // poseList[0]
  // OR
  // 'Tree'

  const sequence1Poses = [
    poseList[0], //Tree
    poseList[1], //Chair
    poseList[2], //Triangle
    poseList[1], //Chair
    poseList[0]  //Tree
  ]
  
  const sequence2Poses = [
    poseList[2], //Triangle
    poseList[1], //Chair
    poseList[0], //Tree
    poseList[1], //Chair
    poseList[2]  //Triangle
  ]

  const sequence3Poses = [
    poseList[1], //Chair
    poseList[0], //Tree
    poseList[2], //Triangle
    poseList[0], //Tree
    poseList[1]  //Chair
  ]
  
  useEffect(() => {
    const timeDiff = (currentTime - startingTime)/1000
    if(flag) {
      setPoseTime(timeDiff)
    }
    if((currentTime - startingTime)/1000 > bestPerform) {
      setBestPerform(timeDiff)
    }
  }, [currentTime])


  useEffect(() => {
    setCurrentTime(new Date(Date()).getTime())
    setPoseTime(0)
    setBestPerform(0)

    // If and when the pose changes during a sequence,
    // runMovenet again to detect the correct pose
    if (isSequence1
      || isSequence2
      || isSequence3) {
      runMovenet()
      console.log('In a sequence. Detecting ', currentPose, ' pose now.')
    }
  }, [currentPose])

  const CLASS_NO = {
    Chair: 0,
    //Cobra: 1,
    //Dog: 2,
    //No_Pose: 3,
    //Shoulderstand: 4,
    Triangle: 5,
    Tree: 6, 
    // Warrior: 7,
  }

  function get_center_point(landmarks, left_bodypart, right_bodypart) {
    let left = tf.gather(landmarks, left_bodypart, 1)
    let right = tf.gather(landmarks, right_bodypart, 1)
    const center = tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5))
    return center
    
  }

  function get_pose_size(landmarks, torso_size_multiplier=2.5) {
    let hips_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
    let shoulders_center = get_center_point(landmarks,POINTS.LEFT_SHOULDER, POINTS.RIGHT_SHOULDER)
    let torso_size = tf.norm(tf.sub(shoulders_center, hips_center))
    let pose_center_new = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
    pose_center_new = tf.expandDims(pose_center_new, 1)

    pose_center_new = tf.broadcastTo(pose_center_new,
        [1, 17, 2]
      )
      // return: shape(17,2)
    let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0)
    let max_dist = tf.max(tf.norm(d,'euclidean', 0))

    // normalize scale
    let pose_size = tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist)
    return pose_size
  }

  function normalize_pose_landmarks(landmarks) {
    let pose_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
    pose_center = tf.expandDims(pose_center, 1)
    pose_center = tf.broadcastTo(pose_center, 
        [1, 17, 2]
      )
    landmarks = tf.sub(landmarks, pose_center)

    let pose_size = get_pose_size(landmarks)
    landmarks = tf.div(landmarks, pose_size)
    return landmarks
  }

  function landmarks_to_embedding(landmarks) {
    // normalize landmarks 2D
    landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0))
    let embedding = tf.reshape(landmarks, [1,34])
    return embedding
  }

  const runMovenet = async () => {
    const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER};
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    const poseClassifier = await tf.loadLayersModel('https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json')
    const countAudio = new Audio(count)
    countAudio.loop = true
    interval = setInterval(() => { 
        detectPose(detector, poseClassifier, countAudio)
    }, 100)
  }

  const detectPose = async (detector, poseClassifier, countAudio) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      let notDetected = 0 
      let noseX = 0
      let noseY = 0
      const video = webcamRef.current.video
      const pose = await detector.estimatePoses(video)
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      try {
        const keypoints = pose[0].keypoints 
        //console.log('Keypoints:', keypoints);
        let input = keypoints.map((keypoint) => {
          if(keypoint.score > 0.4) {
            if(!(keypoint.name === 'left_eye' || keypoint.name === 'right_eye')) {
              if(keypoint.name == 'nose')
              {
                noseX = keypoint.x;
                noseY = keypoint.y;
                //console.log(noseX + ' | ' + noseY)
              }
              //console.log(currentPose);
              drawPoint(currentPose, ctx, keypoint.x, keypoint.y, 8, 'rgb(255,255,255)', keypoint.name, noseX, noseY, 2, 35)
              let connections = keypointConnections[keypoint.name]
              try {
                connections.forEach((connection) => {
                  let conName = connection.toUpperCase()
                  drawSegment(ctx, [keypoint.x, keypoint.y],
                      [keypoints[POINTS[conName]].x,
                       keypoints[POINTS[conName]].y]
                  , skeletonColor)
                })
              } catch(err) {

              }
              
            }
          } else {
            notDetected += 1
          } 
          return [keypoint.x, keypoint.y]
        }) 
        if(notDetected > 4) {
          skeletonColor = 'rgb(0,255,255)'
          return
        }
        else {
          skeletonColor = 'rgb(255,255,255)'
        }
        const processedInput = landmarks_to_embedding(input)
        const classification = poseClassifier.predict(processedInput)

        classification.array().then((data) => {         
          const classNo = CLASS_NO[currentPose]
          //console.log(data[0][classNo])
          if(data[0][classNo] > 0.97) {
            
            if(!flag) {
              countAudio.play()
              setStartingTime(new Date(Date()).getTime())
              flag = true
              console.log('Pose is correctly assumed!')
            }
            setCurrentTime(new Date(Date()).getTime())
            skeletonColor = 'rgb(0,255,0)'
          } else {
            flag = false
            skeletonColor = 'rgb(255,0,0)'
            countAudio.pause()
            countAudio.currentTime = 0
          }
        })
      } catch(err) {
        console.log(err)
      }
    }
  }

  function startYoga(){
    setIsStartPose(true) 
    runMovenet()
  } 

  function stopPose() {
    setIsStartPose(false)
    clearInterval(interval)
  }

  // When starting a sequence the pose is automatically set to the first pose in the sequence array
  function startSequence1(){
    setIsStartSequence1(true)
    setCurrentPose(sequence1Poses[0])
    runMovenet()
  }

  function startSequence2(){
    setIsStartSequence2(true)
    setCurrentPose(sequence2Poses[0])
    runMovenet()
  }

  function startSequence3(){
    setIsStartSequence3(true)
    setCurrentPose(sequence3Poses[0])
    runMovenet()
  }

  // The Step is set to 0 in each method separately so that
  // it is reset correctly when the user stops the sequence before finishing it
  function stopSequence1() {
    setIsStartSequence1(false)
    clearInterval(interval)
    sequenceStep = 0
  }

  function stopSequence2() {
    setIsStartSequence2(false)
    clearInterval(interval)
    sequenceStep = 0
  }

  function stopSequence3() {
    setIsStartSequence3(false)
    clearInterval(interval)
    sequenceStep = 0
  }

  function changeSequencePose() {
    // If the sequence is finished, make sure it is stopped
    if (sequenceStep >= 4) {
      stopSequence1()
      stopSequence2()
      stopSequence3()
    }
    // If the sequence is still ongoing, move on to the next pose
    else {
      clearInterval(interval)
      if (isSequence1) {
        setCurrentPose(sequence1Poses[++sequenceStep])
      }
      else if (isSequence2) {
        setCurrentPose(sequence2Poses[++sequenceStep])
      }
      else if (isSequence3) {
        setCurrentPose(sequence3Poses[++sequenceStep])
      }
    }
  }

  // Checks when the pose timer changes,
  // when it reaches a certain amount it will change the pose in the sequence.
  useEffect(() => {
    // CHANGE THIS NUMBER TO CHANGE HOW LONG EACH POSE NEEDS TO BE HELD FOR IN ORDER TO PROGRESS
    if ((isSequence1
      || isSequence2
      || isSequence3)
      && poseTime >= 8) {
      console.log('Pose change triggered.')
      setPoseTime(0)
      changeSequencePose()
    }
  }, [poseTime])

  // Helper function that increases timer manually when clicked, eases testing
  // Can be deleted
  // * Make sure to delete the marked onClick Events on the timer elements below
  // Or to add the event if you want to use it in sequence 2 or 3
  function faker() {
    setPoseTime(poseTime + 1)
  }

  //Normal poses
  if(isStartPose) {
    return (
      <div className="yoga-container">
        <div className="performance-container">
            <div className="pose-performance"
              onClick={faker}                                // * onClick EVENT HERE
              >
              <h4>Pose Time: {poseTime} s</h4>
            </div>
            <div className="pose-performance">
              <h4>Best: {bestPerform} s</h4>
            </div>
          </div>
        <div>
          
          <Webcam 
          width='640px'
          height='480px'
          id="webcam"
          ref={webcamRef}
          style={{
            position: 'absolute',
            left: 120,
            top: 100,
            padding: '0px',
          }}
        />
          <canvas
            ref={canvasRef}
            id="my-canvas"
            width='640px'
            height='480px'
            style={{
              position: 'absolute',
              left: 120,
              top: 100,
              zIndex: 1
            }}
          >
          </canvas>
        <div>
            <img 
              src={poseImages[currentPose]}
              className="pose-img"
            />
          </div>
         
        </div>
        <button
          onClick={stopPose}
          className="secondary-btn"    
        >Stop Pose</button>
      </div>
    )
  }
  //sequence 1
  if(isSequence1) {
    return (
      <div className="yoga-container">
        <div className="performance-container">
          <div className="pose-performance"
            onClick={faker}                                  // * onClick EVENT HERE
            >
            <h4>Pose Time: {poseTime} s</h4>
          </div>
        </div>
        <div>
          
          <Webcam 
            width='640px'
            height='480px'
            id="webcam"
            ref={webcamRef}
            style={{
              position: 'absolute',
              left: 120,
              top: 100,
              padding: '0px',
            }}
          />
          <canvas
            ref={canvasRef}
            id="my-canvas"
            width='640px'
            height='480px'
            style={{
              position: 'absolute',
              left: 120,
              top: 100,
              zIndex: 1
            }}
          >
          </canvas>
        <div>
          <img
            src={poseImages[currentPose]}
            className="pose-img"
          />
        </div>
        </div>
        <button
          onClick={stopSequence1}
          className="secondary-btn"    
        >Stop Sequence 1</button>
      </div>
    )
  }
  //Sequence 2
  if(isSequence2) {
    return (
      <div className="yoga-container">
        <div className="performance-container">
          <div className="pose-performance"
            onClick={faker}
            >
            <h4>Pose Time: {poseTime} s</h4>
          </div>
        </div>
        <div>
          
          <Webcam 
          width='640px'
          height='480px'
          id="webcam"
          ref={webcamRef}
          style={{
            position: 'absolute',
            left: 120,
            top: 100,
            padding: '0px',
          }}
        />
          <canvas
            ref={canvasRef}
            id="my-canvas"
            width='640px'
            height='480px'
            style={{
              position: 'absolute',
              left: 120,
              top: 100,
              zIndex: 1
            }}
          >
          </canvas>
        <div>
          <img
            src={poseImages[currentPose]}
            className="pose-img"
          />
        </div>
        </div>
        <button
          onClick={stopSequence2}
          className="secondary-btn"    
        >Stop Sequence 2</button>
      </div>
    )
  }

  //Sequence 3
  if(isSequence3) {
    return (
      <div className="yoga-container">
        <div className="performance-container">
          <div className="pose-performance"
            onClick={faker}                                  // * onClick EVENT HERE
            >
            <h4>Pose Time: {poseTime} s</h4>
          </div>
        </div>
        <div>
          
          <Webcam 
          width='640px'
          height='480px'
          id="webcam"
          ref={webcamRef}
          style={{
            position: 'absolute',
            left: 120,
            top: 100,
            padding: '0px',
          }}
        />
          <canvas
            ref={canvasRef}
            id="my-canvas"
            width='640px'
            height='480px'
            style={{
              position: 'absolute',
              left: 120,
              top: 100,
              zIndex: 1
            }}
          >
          </canvas>
        <div>
          <img
            src={poseImages[currentPose]}
            className="pose-img"
          />
        </div>
        </div>
        <button
          onClick={stopSequence3}
          className="secondary-btn"    
        >Stop Sequence 3</button>
      </div>
    )
  }

  return (
    <div
      className="yoga-container"
    >
      <DropDown
        poseList={poseList}
        currentPose={currentPose}
        setCurrentPose={setCurrentPose}
      />
      <Instructions
          currentPose={currentPose}
        />
      <button
          onClick={startYoga}
          className="secondary-btn"
        >Start Pose</button>

      <button
          onClick={startSequence1}
          className="sequence-btn"    
        >Sequence 1</button>
      
      <button
          onClick={startSequence2}
          className="sequence-btn"    
        >Sequence 2</button>
      
      <button
          onClick={startSequence3}
          className="sequence-btn"    
        >Sequence 3</button>

    </div>
  )
}

export default Yoga