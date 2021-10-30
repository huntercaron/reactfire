import firebase from 'firebase/app';
import { QueryChange } from 'rxfire/database';

import { Observable } from 'rxjs';
import { Subject, Subscriber, Subscription } from 'rxjs';


export declare function preloadObservable<T>(source: Observable<T>, id: string): SuspenseSubject<T>;
export interface ObservableStatus<T> {
    /**
     * The loading status.
     *
     * - `loading`: Waiting for the first value from an observable
     * - `error`: Something went wrong. Check `ObservableStatus.error` for more details
     * - `success`: The hook has emitted at least one value
     *
     * If `initialData` is passed in, this will skip `loading` and go straight to `success`.
     */
    status: 'loading' | 'error' | 'success';
    /**
     * Indicates whether the hook has emitted a value at some point
     *
     * If `initialData` is passed in, this will be `true`.
     */
    hasEmitted: boolean;
    /**
     * If this is `true`, the hook will be emitting no further items.
     */
    isComplete: boolean;
    /**
     * The most recent value.
     *
     * If `initialData` is passed in, the first value of `data` will be the valuea provided in `initialData` **UNLESS** the underlying observable is ready, in which case it will skip `initialData`.
     */
    data: T;
    /**
     * Any error that may have occurred in the underlying observable
     */
    error: Error | undefined;
    /**
     * Promise that resolves after first emit from observable
     */
    firstValuePromise: Promise<void>;
}
export declare function useObservable<T>(observableId: string, source: Observable<T | any>, config?: ReactFireOptions): ObservableStatus<T>;

declare type App = firebase.app.App;
export declare const useAuth: typeof firebase.auth;
export declare const useAnalytics: typeof firebase.analytics;
export declare const useDatabase: typeof firebase.database;
export declare const useFirestore: typeof firebase.firestore;
export declare const useFunctions: typeof firebase.functions;
export declare const useMessaging: typeof firebase.messaging;
export declare const usePerformance: typeof firebase.performance;
export declare const useRemoteConfig: typeof firebase.remoteConfig;
export declare const useStorage: typeof firebase.storage;
export declare type PreloadOptions<T> = {
    firebaseApp: App;
    setup?: (instanceFactory: T) => void | Promise<any>;
    suspense?: boolean;
};
export declare const preloadAuth: (options: PreloadOptions<App['auth']>) => Promise<App['auth']>;
export declare const preloadAnalytics: (options: PreloadOptions<App['analytics']>) => Promise<App['analytics']>;
export declare const preloadDatabase: (options: PreloadOptions<App['database']>) => Promise<App['database']>;
export declare const preloadFirestore: (options: PreloadOptions<App['firestore']>) => Promise<App['firestore']>;
export declare const preloadFunctions: (options: PreloadOptions<App['functions']>) => Promise<App['functions']>;
export declare const preloadMessaging: (options: PreloadOptions<App['messaging']>) => Promise<App['messaging']>;
export declare const preloadPerformance: (options: PreloadOptions<App['performance']>) => Promise<App['performance']>;
export declare const preloadRemoteConfig: (options: PreloadOptions<App['remoteConfig']>) => Promise<App['remoteConfig']>;
export declare const preloadStorage: (options: PreloadOptions<App['storage']>) => Promise<App['storage']>;
export {};

export interface SuspensePerfProps {
    children: React.ReactNode;
    traceId: string;
    fallback: React.ReactNode;
    firePerf?: import('firebase/app').default.performance.Performance;
}
export declare function SuspenseWithPerf({ children, traceId, fallback, firePerf }: SuspensePerfProps): JSX.Element;


export declare class SuspenseSubject<T> extends Subject<T> {
    private _timeoutWindow;
    private _value;
    private _hasValue;
    private _timeoutHandler;
    private _firstEmission;
    private _error;
    private _innerObservable;
    private _warmupSubscription;
    private _innerSubscriber;
    private _resolveFirstEmission;
    constructor(innerObservable: Observable<T>, _timeoutWindow: number);
    get hasValue(): boolean;
    get value(): T | undefined;
    get firstEmission(): Promise<void>;
    private _next;
    private _reset;
    _subscribe(subscriber: Subscriber<T>): Subscription;
    get ourError(): any;
}


export declare type ReactFireGlobals = {
    _reactFireDatabaseCachedQueries: Array<firebase.database.Query>;
    _reactFireFirestoreQueryCache: Array<firebase.firestore.Query>;
    _reactFirePreloadedObservables: Map<string, SuspenseSubject<any>>;
};
export declare class ReactFireError extends Error {
    readonly code: string;
    customData?: Record<string, unknown> | undefined;
    readonly name = "ReactFireError";
    constructor(code: string, message: string, customData?: Record<string, unknown> | undefined);
}
export interface ReactFireOptions<T = unknown> {
    idField?: string;
    initialData?: T | any;
    /**
     * @deprecated use initialData instead
     */
    startWithValue?: T | any;
    suspense?: boolean;
}
export declare function checkOptions(options: ReactFireOptions, field: string): any;
export declare function checkinitialData(options: ReactFireOptions): any;
export declare function checkIdField(options: ReactFireOptions): any;


/**
 * Subscribe to a Realtime Database object
 *
 * @param ref - Reference to the DB object you want to listen to
 * @param options
 */
export declare function useDatabaseObject<T = unknown>(ref: firebase.database.Reference, options?: ReactFireOptions<T>): ObservableStatus<QueryChange | T>;
export declare function useDatabaseObjectData<T>(ref: firebase.database.Reference, options?: ReactFireOptions<T>): ObservableStatus<T>;
/**
 * Subscribe to a Realtime Database list
 *
 * @param ref - Reference to the DB List you want to listen to
 * @param options
 */
export declare function useDatabaseList<T = {
    [key: string]: unknown;
}>(ref: firebase.database.Reference | firebase.database.Query, options?: ReactFireOptions<T[]>): ObservableStatus<QueryChange[] | T[]>;
export declare function useDatabaseListData<T = {
    [key: string]: unknown;
}>(ref: firebase.database.Reference | firebase.database.Query, options?: ReactFireOptions<T[]>): ObservableStatus<T[]>;

/**
 * Subscribe to the progress of a storage task
 *
 * @param task - the task you want to listen to
 * @param ref - reference to the blob the task is acting on
 * @param options
 */
export declare function useStorageTask<T = unknown>(task: firebase.storage.UploadTask, ref: firebase.storage.Reference, options?: ReactFireOptions<T>): ObservableStatus<firebase.storage.UploadTaskSnapshot | T>;
/**
 * Subscribe to a storage ref's download URL
 *
 * @param ref - reference to the blob you want to download
 * @param options
 */
export declare function useStorageDownloadURL<T = string>(ref: firebase.storage.Reference, options?: ReactFireOptions<T>): ObservableStatus<string | T>;
declare type StorageImageProps = {
    storagePath: string;
    storage?: firebase.storage.Storage;
    suspense?: boolean;
    placeHolder?: JSX.Element;
};
export declare function StorageImage(props: StorageImageProps & React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>): JSX.Element;
export {};

/**
 * Suscribe to Firestore Document changes
 *
 * @param ref - Reference to the document you want to listen to
 * @param options
 */
export declare function useFirestoreDoc<T = firebase.firestore.DocumentData>(ref: firebase.firestore.DocumentReference, options?: ReactFireOptions<T>): ObservableStatus<firebase.firestore.DocumentSnapshot<T>>;
/**
 * Get a firestore document and don't subscribe to changes
 *
 * @param ref - Reference to the document you want to get
 * @param options
 */
export declare function useFirestoreDocOnce<T = unknown>(ref: firebase.firestore.DocumentReference, options?: ReactFireOptions<T>): ObservableStatus<T extends {} ? T : firebase.firestore.DocumentSnapshot>;
/**
 * Suscribe to Firestore Document changes
 *
 * @param ref - Reference to the document you want to listen to
 * @param options
 */
export declare function useFirestoreDocData<T>(ref: firebase.firestore.DocumentReference, options?: ReactFireOptions<T>): ObservableStatus<T>;
/**
 * Get a firestore document and don't subscribe to changes
 *
 * @param ref - Reference to the document you want to get
 * @param options
 */
export declare function useFirestoreDocDataOnce<T = unknown>(ref: firebase.firestore.DocumentReference, options?: ReactFireOptions<T>): ObservableStatus<T>;
/**
 * Subscribe to a Firestore collection
 *
 * @param ref - Reference to the collection you want to listen to
 * @param options
 */
export declare function useFirestoreCollection<T = firebase.firestore.DocumentData>(query: firebase.firestore.Query, options?: ReactFireOptions<T[]>): ObservableStatus<firebase.firestore.QuerySnapshot<T>>;
/**
 * Subscribe to a Firestore collection and unwrap the snapshot.
 *
 * @param ref - Reference to the collection you want to listen to
 * @param options
 */
export declare function useFirestoreCollectionData<T = {
    [key: string]: unknown;
}>(query: firebase.firestore.Query, options?: ReactFireOptions<T[]>): ObservableStatus<T[]>;


declare type Props = {
    firebaseApp?: firebase.app.App;
    firebaseConfig?: Object;
    appName?: string;
    suspense?: boolean;
};
export declare const version: any;
export declare function FirebaseAppProvider(props: Props & {
    [key: string]: unknown;
}): JSX.Element;
export declare function useIsSuspenseEnabled(): boolean;
export declare function useSuspenseEnabledFromConfigAndContext(suspenseFromConfig?: boolean): boolean;
export declare function useFirebaseApp(): firebase.app.App;


export declare function preloadUser(options: {
    firebaseApp: firebase.app.App;
}): Promise<firebase.User | null>;
/**
 * Subscribe to Firebase auth state changes, including token refresh
 *
 * @param options
 */
export declare function useUser<T = unknown>(options?: ReactFireOptions<T>): ObservableStatus<firebase.User>;
export declare function useIdTokenResult(user: firebase.User, forceRefresh?: boolean, options?: ReactFireOptions<firebase.auth.IdTokenResult>): ObservableStatus<firebase.auth.IdTokenResult>;
export interface AuthCheckProps {
    fallback: React.ReactNode;
    children: React.ReactNode;
    requiredClaims?: Object;
}
export interface ClaimsCheckProps {
    user: firebase.User;
    fallback: React.ReactNode;
    children: React.ReactNode;
    requiredClaims: {
        [key: string]: any;
    };
}
export interface ClaimCheckErrors {
    [key: string]: any[];
}
export declare type SigninCheckResult = {
    signedIn: false;
    hasRequiredClaims: false;
    errors: {};
    user: null;
} | {
    signedIn: true;
    hasRequiredClaims: boolean;
    errors: ClaimCheckErrors;
    user: firebase.User;
};
export interface SignInCheckOptionsBasic extends ReactFireOptions<SigninCheckResult> {
    forceRefresh?: boolean;
}
export interface SignInCheckOptionsClaimsObject extends SignInCheckOptionsBasic {
    requiredClaims: firebase.auth.IdTokenResult['claims'];
}
export interface ClaimsValidator {
    (claims: firebase.auth.IdTokenResult['claims']): {
        hasRequiredClaims: boolean;
        errors: ClaimCheckErrors | {};
    };
}
export interface SignInCheckOptionsClaimsValidator extends SignInCheckOptionsBasic {
    validateCustomClaims: ClaimsValidator;
}
/**
 * Subscribe to the signed-in status of a user.
 *
 * ```ts
 * const { status, data:signInCheckResult } = useSigninCheck();
 *
 * if (status === 'loading') {
 *   return <LoadingSpinner />}
 *
 *
 * if (signInCheckResult.signedIn === true) {
 *   return <ProfilePage user={signInCheckResult.user}/>
 * } else {
 *   return <SignInForm />
 * }
 * ```
 *
 * Optionally check [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims) of a user as well.
 *
 * ```ts
 * // pass in an object describing the custom claims a user must have
 * const {status, data: signInCheckResult} = useSignInCheck({requiredClaims: {admin: true}});
 *
 * // pass in a custom claims validator function
 * const {status, data: signInCheckResult} = useSignInCheck({validateCustomClaims: (userClaims) => {
 *   // custom validation logic...
 * }});
 *
 * // You can optionally force-refresh the token
 * const {status, data: signInCheckResult} = useSignInCheck({forceRefresh: true, requiredClaims: {admin: true}});
 * ```
 */
export declare function useSigninCheck(options?: SignInCheckOptionsBasic | SignInCheckOptionsClaimsObject | SignInCheckOptionsClaimsValidator): ObservableStatus<SigninCheckResult>;
/**
 * @deprecated Use `useSignInCheck` instead
 *
 * Conditionally render children based on [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).
 *
 * Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).
 */
export declare function ClaimsCheck({ user, fallback, children, requiredClaims }: ClaimsCheckProps): JSX.Element;
/**
 * @deprecated Use `useSignInCheck` instead
 *
 * Conditionally render children based on signed-in status and [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).
 *
 * Meant for Concurrent mode only (`<FirebaseAppProvider suspense=true />`). [More detail](https://github.com/FirebaseExtended/reactfire/issues/325#issuecomment-827654376).
 */
export declare function AuthCheck({ fallback, children, requiredClaims }: AuthCheckProps): JSX.Element;
