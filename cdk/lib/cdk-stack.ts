import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as path from "path";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a new VPC
    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 2,
      natGateways: 1,
    });

    // Create a new ECS cluster
    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc: vpc,
    });

    // Create a new Fargate task definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, "MyTaskDef", {
      memoryLimitMiB: 512,
      cpu: 256,
      runtimePlatform: {
        cpuArchitecture: ecs.CpuArchitecture.ARM64,
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
      },
    });

    const container = taskDefinition.addContainer("MyContainer", {
      image: ecs.ContainerImage.fromAsset(
        path.join(__dirname, "../../")
      ),
      logging: new ecs.AwsLogDriver({ streamPrefix: "express-app" }),
    });

    container.addPortMappings({
      containerPort: 3000,
    });

    // Create a new Fargate service with an Application Load Balancer
    const certificate =
      cdk.aws_certificatemanager.Certificate.fromCertificateArn(
        this,
        "MyCertificate",
        "arn:aws:acm:us-east-1:266345157701:certificate/3b64b967-7ed9-4a18-91fa-b3737be5a20c"
      );

    const fargateService =
      new ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        "MyFargateService",
        {
          cluster: cluster,
          taskDefinition: taskDefinition,
          desiredCount: 1,
          assignPublicIp: false,
          protocol: elbv2.ApplicationProtocol.HTTPS,
          redirectHTTP: true,
          certificate: certificate,
          publicLoadBalancer: true,
          openListener: true,
        }
      );

    const albSecurityGroup = new ec2.SecurityGroup(this, "AlbSecurityGroup", {
      vpc: vpc,
      allowAllOutbound: true,
    });

    fargateService.loadBalancer.addSecurityGroup(albSecurityGroup);

    const cloudFrontPrefixList = ec2.PrefixList.fromLookup(
      this,
      "CloudFrontPrefixList",
      {
        prefixListName: "com.amazonaws.global.cloudfront.origin-facing",
      }
    );
    albSecurityGroup.addIngressRule(
      ec2.Peer.prefixList(cloudFrontPrefixList.prefixListId),
      ec2.Port.tcp(443)
    );

    // Create a new CloudFront distribution
    const distribution = new cloudfront.Distribution(this, "MyDistribution", {
      defaultBehavior: {
        origin: new origins.LoadBalancerV2Origin(fargateService.loadBalancer),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.USE_ORIGIN_CACHE_CONTROL_HEADERS,
        originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
      },
      domainNames: ["hansonwg.com"],
      certificate: certificate,
    });

    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: distribution.distributionDomainName,
    });

    new cdk.CfnOutput(this, "ALB_URL", {
      value: fargateService.loadBalancer.loadBalancerDnsName,
    });
  }
}
