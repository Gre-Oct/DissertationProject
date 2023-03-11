import React from 'react'

import './About.css'

export default function About() {
    return (
        <div className="about-container">
            <h1 className="about-heading">About</h1>
            <div className="about-main">
                <p className="about-content">
                    This project is a realtime Yoga pose correction prototype that is aimed to help beginners 
                    when starting their yoga journey. This prototype was built on a pre-trained model. The original
                    open source project can be found on GitHub - <a href="https://github.com/harshbhatt7585/YogaIntelliJ">https://github.com/harshbhatt7585/YogaIntelliJ</a>
                </p>
                
                <p className="about-content">    
                    The prototype detects keypoints on different parts of the body, then uses a 
                    classification model to classify the Yoga pose. If the user is performing the Yoga pose properly (at least 95% similarity to the pose)
                    they will be notified by the virtual skeleton turning green and a sound playing. 
                    The pre-trained Tensorflow Movenet Model was used to predict the keypoints and a neural network was built 
                    to use these keypoints and classify a yoga pose.
                </p>
                <p className="about-content">
                    The model was trained in python because tensorflowJS provides browser support.
                </p>
            </div>
        </div>
    )
}
