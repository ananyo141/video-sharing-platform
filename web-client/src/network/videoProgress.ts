import { gql, GraphQLClient } from 'graphql-request';

interface VideoProgress {
    videoId: string;
    userId: string;
    progress: number;
    updatedAt: Date;
}

async function subscribeToVideoProgress(videoId: string) {
    const endpoint = 'YOUR_GRAPHQL_ENDPOINT';
    
    const subscriptionQuery = gql`
        subscription {
            videoProgress(videoId: "${videoId}") {
                videoId
                userId
                progress
                updatedAt
            }
        }
    `;

    // const subscriptionClient = new SubscriptionClient(endpoint, { reconnect: true });
    // const graphQLClient = new GraphQLClient(endpoint, {
    //     subscription: subscriptionClient,
    // });

    // const subscription = graphQLClient.subscribe({ query: subscriptionQuery });

    // subscription.subscribe({
    //     next: (data: { videoProgress: VideoProgress }) => {
    //         // Handle received data
    //         console.log('Received data:', data);
    //     },
    //     error: (error: any) => {
    //         console.error('Subscription error:', error);
    //     },
    //     complete: () => {
    //         console.log('Subscription complete');
    //     },
    // });
}

// Example usage:
subscribeToVideoProgress("video-upload-ho-rha-_1712301281154.mp4");
