/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-param-reassign */
/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { FaCalendarTimes } from 'react-icons/fa';
import { FaPersonBooth } from 'react-icons/fa';
import Prismic from '@prismicio/client';
import Link from 'next/link';

import { GetStaticProps } from 'next';
import { Head } from 'next/document';

import { useEffect, useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  // const [posts, setPosts] = useState<PostPagination>(postsPagination);
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const fetchMorePosts = next_page => {
    fetch(next_page)
      .then(response => response.json())
      .then(data => {
        setPosts([...posts, ...data.results]);
        setNextPage(data.next_page);
      });
  };

  const dateFormat = post => {
    return new Date(post).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* <Head>
        <title>Posts | Blog</title>
      </Head> */}

      <main className={styles.container}>
        <div className={styles.postList}>
          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div className={styles.info}>
                  <time>
                    <FaCalendarTimes />
                    {dateFormat(post.first_publication_date)}
                  </time>
                  <span>
                    <FaPersonBooth /> {post.data.author}
                  </span>
                </div>
              </a>
            </Link>
          ))}
        </div>
        {nextPage ? (
          <div className={styles.morePosts}>
            <button onClick={() => fetchMorePosts(nextPage)}>
              Carregar mais posts
            </button>
          </div>
        ) : (
          ''
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 1,
      page: 1,
      orderings: '[post.first_publication_date desc]',
    }
  );

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });
  const postsPagination = { results, next_page: postsResponse.next_page };

  return { props: { postsPagination } };
};
