import { parse } from 'cookie';
import { getUserIDFromJWT } from 'vizhub-controllers';

export const identifyAgent = (request, done) => {
  // If the connection is coming from the browser,
  if (request.req) {
    const cookie = request.req.headers.cookie;
    if (cookie) {
      const { vizHubJWT } = parse(cookie);

      console.log(JSON.stringify(parse(cookie, null, 2)));

      // and the user is authenticated,
      // expose the user id to downstream middleware via agent.session.
      if (vizHubJWT) {
        request.agent.userId = getUserIDFromJWT(vizHubJWT);
      }
    }
  } else {
    // Otherwise set a flag that clarifies that
    // the connection is coming from the server (e.g. for creating User entries).
    request.agent.isServer = true;
  }

  done();
};
