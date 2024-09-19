pipeline {
    agent any
    
    environment {
        VeracodeID = '98f346dc37cfb6ca5684df4113a0d6eb'
        VeracodeKey    = '154225e64de02b19abcc690d85bd6d5d1d4f40951c9ec0f0f5e08cebc968f34573793c506c05e17d549ae0c3ed9f2978c43e627dd7710af5ba1dd2bef7651618'
        VeracodeProfile = 'LabRafa_Legends'
        SRCCLR_API_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTAzMDIwLCJleHAiOjE3MjY3MzIxMjEsImF1dGhvcml0aWVzIjoiQUdFTlQiLCJqdGkiOiJlODFjNmI3YS1kZDFmLTQ2MmQtYjU2MS0xYTliNzAxMzA2YzYiLCJjbGllbnRfaWQiOiIiLCJzY29wZSI6W119.jZvYs1IRABG9lh-Dev1ajVk0xh8FELcJDvT0BuFOk4sjCG5mB5ku_Q8IL_5LCmS4mBWC-phLWiyiNG2tUeAAMNsUu55hSSd-KZg4SWaLI0QEVSQV3zQF6ShKuABvAG1U2Eqs0YRZvEnqPp9ylku1KE8dM8wlLsYH4Oei6m9mA1k'
        CaminhoPacote = 'pacoteVeracode.zip'
    }

    stages {
        stage('Clean') {
            steps {
                sh 'rm -rf pacoteVeracode.zip'
                sh 'rm -rf veracode-wrapper.jar'
                sh 'rm -rf pipeline-scan.jar'
            }
        }
        stage('Git Clone') {
            steps {
                git url: 'git@github.com:rafahmarinho/LabAfrika_Legends.git', credentialsId: 'github-credentials-rafa-ssh'
            }
        }
                stage('Clean Directories') {
            steps {
                sh 'rm -rf public migrations prisma node_modules'
                sh 'ls'
            }
        }
        stage('Archive') {
            steps {
                sh 'zip -r ${CaminhoPacote} . -x ".git/*"'
            }
        }
        stage('SCA') {
            steps {
                sh 'curl -sSL https://download.sourceclear.com/ci.sh | bash -s scan --allow-dirty'
            }
        }
        stage('SAST Upload') {
            steps {
                sh 'curl -o veracode-wrapper.jar https://repo1.maven.org/maven2/com/veracode/vosp/api/wrappers/vosp-api-wrappers-java/21.2.7.4/vosp-api-wrappers-java-21.2.7.4.jar'
                sh 'java -jar veracode-wrapper.jar -vid ${VeracodeID} -vkey ${VeracodeKey} -action uploadandscan -appname ${VeracodeProfile} -createprofile true  -version $(date +%H%M%s%d%m%y) -filepath ${CaminhoPacote}'
            }
        }
        stage('Pipeline Scan') {
            steps {
                sh 'curl -sSO https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip'
                sh 'unzip -o pipeline-scan-LATEST.zip'
                sh 'java -jar pipeline-scan.jar -vid ${VeracodeID} -vkey ${VeracodeKey} -f ${CaminhoPacote} --issue_details true'
            }
        }
    }
}