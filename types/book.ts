export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Book = {
  __typename?: 'Book';
  completed?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  rating?: Maybe<Scalars['Int']>;
  reviews?: Maybe<Array<Maybe<Scalars['String']>>>;
  title: Scalars['String'];
};

export type BookInput = {
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBook?: Maybe<Book>;
};


export type MutationCreateBookArgs = {
  book: BookInput;
};

export type Query = {
  __typename?: 'Query';
  listBooks?: Maybe<Array<Maybe<Book>>>;
};
