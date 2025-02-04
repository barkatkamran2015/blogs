import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../PostDetailPage.css";

const PostDetailPage = () => {
  const { id } = useParams();
  const postId = Number(id) || parseInt(id, 10);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) {
      setError("Invalid post ID.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchPost = async () => {
      try {
        const response = await fetch(
          `https://www.barkatkamran.com/db.php?method=GET_POST&id=${postId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    return () => controller.abort();
  }, [postId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Extract styles from the API response
  const backgroundColor = post?.backgroundColor || "#fafafa";
  let titleStyle = {};

  try {
    titleStyle = post?.titleStyle ? JSON.parse(post.titleStyle) : {};
  } catch (e) {
    console.error("Error parsing titleStyle:", e);
  }

  return (
    <div className="post-detail-container" style={{ backgroundColor }}>
      {post ? (
        <>
          <h1 style={titleStyle}>{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title || "Post Image"}
            />
          )}
          <p>Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
        </>
      ) : (
        <p className="post-not-found">Post not found.</p>
      )}
    </div>
  );
};

export default PostDetailPage;
