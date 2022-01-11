/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';

import { FiUser } from 'react-icons/fi';
import { FiCalendar } from 'react-icons/fi';
import { FiClock } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

const dateFormat = post => {
  return format(new Date(post), 'dd MMM yyyy', {
    locale: ptBR,
  });
};

const readingTime = content => {
  const text = content;
  const wpm = 225;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return time;
};

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      {/* <Head>
				<title>{post.title} | Ignews</title>
			</Head> */}
      <main className={styles.container}>
        <img src={post.data.banner.url} alt="logo" />

        <div className={styles.post}>
          <h1>{post.data.title}</h1>
          <div className={styles.info}>
            <time>
              <FiCalendar />
              {dateFormat(post.first_publication_date)}
            </time>
            <span>
              <FiUser /> {post.data.author}
            </span>
            <span>
              <FiClock />
              {readingTime('iokjgkosdfgjnf')}
              min
            </span>
          </div>

          {post.data.content.map(contents => (
            <div className={styles.content} key={contents.heading}>
              <h2>{contents.heading}</h2>
              <span>
                {contents.body.map(bodies => RichText.asText(bodies.text))}
              </span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.author'],
    }
  );

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();

  const response = await prismic.getByUID(
    'post',
    String(context.params.slug),
    {}
  );

  const post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: [
        {
          heading: response.data.content.map(contents => contents.heading),
          body: [
            {
              text: response.data.content.map(bodies => bodies.body),
            },
          ],
        },
      ],
    },
  };
  console.log(post);

  return { props: { post }, redirect: 60 * 30 };
};
