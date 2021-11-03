import { SWRResponse, SWRConfiguration, Key } from 'swr';
declare type Props<Data, Error> = {
    /**
     * Required: pass the `mutate` function returned to you by SWR.
     */
    mutate: SWRResponse<Data, Error>['mutate'];
} & Pick<SWRConfiguration, 'revalidateOnFocus' | 'revalidateOnReconnect' | 'focusThrottleInterval'>;
/**
 * swr-react-native
 *
 * This helps you revalidate your SWR calls, based on navigation actions in `react-navigation`.
 */
export declare function useSWRNativeRevalidate<Data = any, Error = any>(props: Props<Data, Error>): void;
declare type Fetcher<Data> = ((...args: any) => Data | Promise<Data>) | null;
declare const useSWRNative: <Data = any, Error_1 = any>(key: Key, fn?: Fetcher<Data>, config?: Partial<import("swr/dist/types").Configuration<Data, Error_1, import("swr/dist/types").Fetcher<Data>>> | undefined) => SWRResponse<Data, Error_1>;
export default useSWRNative;
