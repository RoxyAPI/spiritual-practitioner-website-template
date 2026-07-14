import type { SearchCitiesResponse } from '@roxyapi/ui-react';

/**
 * One city from the location search, taken straight from the response type rather than redeclared. A hand-written interface here would keep compiling after the API adds a field and quietly render nothing, which is the failure mode this import exists to prevent.
 */
export type City = NonNullable<SearchCitiesResponse['cities']>[number];
