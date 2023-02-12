pipeline { 
    agent {
        node {
            label 'master'
        }
    }
    options {
        ansiColor('xterm')
    }
    environment { 
        DOCKERHUB_USER = 'ady28'
        IMAGE_NAME = 'stocks-frontend'
        IMAGE_VERSION = ''
        KUBERNETES_API = 'https://proxtest1:6443'
        STOCKS_APP_NAMESPACE = 'stocks-app'
        STOCKS_APP_DEPLOYMENT = 'stocks-app-frontend'
    }
    stages {
        stage('Dockerfile check') {
            steps {
                script {
                    sh "hadolint Dockerfile --info DL3008 -t warning -f json > dockerfile_lint.json"
                }
            }
        }
        stage('Build') { 
            steps { 
                echo "Running build stage for ${env.IMAGE_NAME}"
                script {
                    IMAGE_VERSION = readFile('VERSION').trim()
                    image = docker.build("${env.DOCKERHUB_USER}/${env.IMAGE_NAME}:${IMAGE_VERSION}-test", "--build-arg env_mode=testing .")
                    docker.withRegistry("https://registry.hub.docker.com", 'dockerhub-pub') {
                        image.push()
                    }
                }
            }
        }
        stage('Generate SBOM file') {
            steps {
                sh "docker sbom ${env.DOCKERHUB_USER}/${env.IMAGE_NAME}:${IMAGE_VERSION}-test --format syft-json -o sbom.json"
                sh "npm audit --omit dev --json --audit-level none > node_sec_analysis.json"
            }
        }
        stage('Security analysis') {
            steps {
                sh "trivy image ${env.DOCKERHUB_USER}/${env.IMAGE_NAME}:${IMAGE_VERSION}-test -f json -o trivycheck.json"
            }
        }
        stage('Tag Test Image'){
            steps {
                echo "Push image for testing"
                script {
                    docker.withRegistry("https://registry.hub.docker.com", 'dockerhub-pub') {
                        image.push("test")
                    }
                }
            }
        }
        stage('Deploy Test Infrastructure') {
            steps {
                build job: 'stocks-app-test-deploy'
            }
        }
        stage('Ask to go in qual') {
            steps {
                input('Do you want to proceed to the qual environment?')
            }
        }
        stage('Build qual image') { 
            steps { 
                echo "Running qual build stage for ${env.IMAGE_NAME}"
                script {
                    IMAGE_VERSION = readFile('VERSION').trim()
                    image = docker.build("${env.DOCKERHUB_USER}/${env.IMAGE_NAME}:${IMAGE_VERSION}-qual", "--build-arg env_mode=qual .")
                    docker.withRegistry("https://registry.hub.docker.com", 'dockerhub-pub') {
                        image.push()
                    }
                }
            }
        }
        stage('Tag Qual Image'){
            steps {
                echo "Push image for qual"
                script {
                    docker.withRegistry("https://registry.hub.docker.com", 'dockerhub-pub') {
                        image.push("qual")
                    }
                }
            }
        }
        stage('Deploy Qual Infrastructure') {
            steps {
                echo "Restarting the deployment"
                withKubeConfig([credentialsId: 'local_kube_stocksapp', serverUrl: "${env.KUBERNETES_API}", namespace: "${env.STOCKS_APP_NAMESPACE}"]) {
                    sh "kubectl rollout restart deployment ${env.STOCKS_APP_DEPLOYMENT}"
                }
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'sbom.json, dockerfile_lint.json, trivycheck.json, node_sec_analysis.json', fingerprint: true
        }
    }
}