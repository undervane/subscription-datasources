import gql from 'graphql-tag';
import { GatewayDataSource } from 'federation-subscription-tools';

export class LiveBlogDataSource extends GatewayDataSource {
  constructor(gatewayUrl) {
    super(gatewayUrl);
  }

  initialize(config): void | Promise<void> {
    (this as any).context = config.context;
  }

  willSendRequest(request) {
    if (!request.headers) {
      request.headers = {};
    }

    request.headers['apollographql-client-name'] = 'Subscriptions Service';
    request.headers['apollographql-client-version'] = '0.1.0';

    // Forwards the encoded token extracted from the `connectionParams` with
    // the request to the gateway
    request.headers.authorization = `Bearer ${(this as any).context.token}`;
  }

  async fetchAndMergeNonPayloadPostData(postID, payload, info) {
    const selections = (this as any).buildNonPayloadSelections(payload, info);
    const payloadData = Object.values(payload)[0];

    if (!selections) {
      return payloadData;
    }

    const Subscription_GetPost = gql`
      query Subscription_GetPost($id: ID!) {
        post(id: $id) {
          ${selections}
        }
      }
    `;

    try {
      const response = await (this as any).query(Subscription_GetPost, {
        variables: { id: postID },
      } as any);
      return (this as any).mergeFieldData(payloadData, response.data.post);
    } catch (error) {
      console.error(error);
    }
  }
}
