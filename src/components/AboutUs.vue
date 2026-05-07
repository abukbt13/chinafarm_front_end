<script setup>

import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";
</script>

  <template>
    <Navbar />
    <div class="about-wrapper">
      <div class="about-container">

        <!-- Left Section -->
        <div class="about-left">
          <h1 class="title">About MyTracker</h1>

          <p class="description">
            MyTracker is a modern project management platform designed to help
            individuals and businesses track expenses, monitor returns, and
            visualize project progress with ease.
          </p>

          <div class="contact-card">
            <div class="contact-item">
              <div class="icon">📍</div>
              <div>
                <h3>Location</h3>
                <p>Kapsowar, Kenya</p>
              </div>
            </div>

            <div class="contact-item">
              <div class="icon">📞</div>
              <div>
                <h3>Phone Number</h3>
                <p>07285487</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Section -->
        <div class="about-right">
          <h2>Why Choose Us?</h2>

          <p class="right-description">
            We simplify project management by providing powerful tools for
            expense tracking, returns calculation, milestone monitoring, and
            visual reporting — all in one platform.
          </p>

          <div class="features-grid">
            <div class="feature-box">
              <h3>Expense Tracking</h3>
              <p>
                Keep records of project expenses easily and accurately.
              </p>
            </div>

            <div class="feature-box">
              <h3>Returns Analysis</h3>
              <p>
                Calculate profits and monitor project performance.
              </p>
            </div>

            <div class="feature-box">
              <h3>Visual Reports</h3>
              <p>
                Understand project progress using clean charts and visuals.
              </p>
            </div>

            <div class="feature-box">
              <h3>Easy Management</h3>
              <p>
                Organize milestones, records, and activities from one dashboard.
              </p>
            </div>
          </div>

          <button class="learn-btn">Learn More</button>
        </div>

      </div>
    </div>

    <Footer />
  </template>

  <style scoped>
    .about-wrapper {
      min-height: 100vh;
      background: linear-gradient(to bottom right, #f0fdf4, #ffffff);
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .about-container {
      width: 100%;
      max-width: 1200px;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .about-left {
      background: #15803d;
      color: white;
      padding: 40px;
    }

    .title {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .description {
      line-height: 1.8;
      color: #dcfce7;
      margin-bottom: 30px;
    }

    .contact-card {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .icon {
      width: 50px;
      height: 50px;
      background: rgba(255,255,255,0.2);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
    }

    .about-right {
      padding: 40px;
    }

    .about-right h2 {
      font-size: 2rem;
      margin-bottom: 20px;
      color: #1f2937;
    }

    .right-description {
      color: #6b7280;
      line-height: 1.8;
      margin-bottom: 30px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .feature-box {
      background: #f0fdf4;
      border: 1px solid #dcfce7;
      padding: 20px;
      border-radius: 18px;
      transition: 0.3s ease;
    }

    .feature-box:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }

    .feature-box h3 {
      color: #15803d;
      margin-bottom: 10px;
    }

    .feature-box p {
      color: #6b7280;
      font-size: 0.95rem;
    }

    .learn-btn {
      margin-top: 30px;
      padding: 14px 24px;
      background: #15803d;
      color: white;
      border: none;
      border-radius: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s ease;
    }

    .learn-btn:hover {
      background: #166534;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .about-container {
        grid-template-columns: 1fr;
      }

      .about-left,
      .about-right {
        padding: 25px;
      }

      .title {
        font-size: 2rem;
      }

      .about-right h2 {
        font-size: 1.6rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }

</style>