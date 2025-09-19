/* eslint-disable max-len */
import { onSchedule } from "firebase-functions/scheduler";
import { onTaskDispatched } from "firebase-functions/tasks";
import { logger } from "firebase-functions";
import { redis } from "./redis";
import { firestore } from "./firebase-king";
import { FieldValue } from "firebase-admin/firestore";
// import nodemailer from "nodemailer";

export const resetRedis = onSchedule(
  { schedule: "0 8-20/1 * * *", timeZone: "Asia/Calcutta" },
  async () => {
    try {
      const timestamp = Date.now();
      const cutoffTime = timestamp - 24 * 60 * 60 * 1000;

      const redisMysteryViewCountKeys = await redis.keys("mystery:viewCount:*");
      const redisCategoryViewCountKeys = await redis.keys(
        "category:viewCount:*",
      );
      const redisKeyRecentViews = await redis.keys("mystery:recentViews:*");

      if (
        redisMysteryViewCountKeys.length === 0 &&
        redisCategoryViewCountKeys.length === 0 &&
        redisKeyRecentViews.length === 0
      ) {
        logger.info("No keys found in Redis, skipping processing.");
        return;
      }

      const redisPipeline = redis.pipeline();

      [...redisMysteryViewCountKeys, ...redisCategoryViewCountKeys].forEach(
        (key) => {
          redisPipeline.get(key);
        },
      );
      redisKeyRecentViews.forEach((key) => {
        redisPipeline.zcount(key, cutoffTime, timestamp);
      });

      const results = await redisPipeline.exec();

      if (!results || results.length === 0) {
        logger.error(
          "No results found after pipeline execution, So did Nothing!",
        );
        return;
      }

      const mysteryViewCounts = results.slice(
        0,
        redisMysteryViewCountKeys.length,
      );
      const categoryViewCounts = results.slice(
        redisMysteryViewCountKeys.length,
        redisCategoryViewCountKeys.length,
      );
      const recentViewCounts = results.slice(
        redisMysteryViewCountKeys.length + redisCategoryViewCountKeys.length,
      );

      const updates: Record<string, Record<string, unknown>> = {};
      const categoryUpdates: Record<string, Record<string, unknown>> = {};

      mysteryViewCounts.forEach(([err, count], index) => {
        const mysteryId = redisMysteryViewCountKeys[index].split(":").pop();
        if (!err && count && mysteryId) {
          const parsedCount = parseInt(count as string, 10);
          if (!isNaN(parsedCount)) {
            updates[mysteryId] = updates[mysteryId] || {};
            updates[mysteryId].viewsCount = FieldValue.increment(parsedCount);
          } else {
            logger.error(
              `Invalid mystery view count for key ${redisMysteryViewCountKeys[index]}: ${count}`,
            );
          }
        } else if (err) {
          logger.error(
            `Error retrieving mystery view count for key ${redisMysteryViewCountKeys[index]}: ${err}`,
          );
        }
      });

      categoryViewCounts.forEach(([err, count], index) => {
        const categoryId = redisCategoryViewCountKeys[index].split(":").pop();
        if (!err && count && categoryId) {
          const parsedCount = parseInt(count as string, 10);
          if (!isNaN(parsedCount)) {
            categoryUpdates[categoryId] = categoryUpdates[categoryId] || {};
            categoryUpdates[categoryId].viewsCount =
              FieldValue.increment(parsedCount);
          } else {
            logger.error(
              `Invalid category view count for key ${redisCategoryViewCountKeys[index]}: ${count}`,
            );
          }
        } else if (err) {
          logger.error(
            `Error retrieving category view count for key ${redisCategoryViewCountKeys[index]}: ${err}`,
          );
        }
      });

      recentViewCounts.forEach(([err, count], index) => {
        const mysteryId = redisKeyRecentViews[index].split(":").pop();
        if (!err && count && mysteryId) {
          const parsedCount = parseInt(count as string, 10);
          if (!isNaN(parsedCount)) {
            updates[mysteryId] = updates[mysteryId] || {};
            updates[mysteryId].viewsInLast24Hours = parsedCount;
          } else {
            logger.error(
              `Invalid recent view count for key ${redisKeyRecentViews[index]}: ${count}`,
            );
          }
        } else if (err) {
          logger.error(
            `Error retrieving recent view count for key ${redisKeyRecentViews[index]}: ${err}`,
          );
        }
      });

      const batch = firestore.batch();
      let batchHasOperations = false;

      Object.entries(updates).forEach(([mysteryId]) => {
        const docRef = firestore.collection("mysteries").doc(mysteryId);
        batch.set(docRef, updates[mysteryId], { merge: true });
        batchHasOperations = true;
      });

      Object.entries(categoryUpdates).forEach(([categoryId]) => {
        const docRef = firestore.collection("categories").doc(categoryId);
        batch.set(docRef, categoryUpdates[categoryId], { merge: true });
        batchHasOperations = true;
      });

      if (batchHasOperations) {
        await batch.commit();
      } else {
        logger.info("No Firestore updates needed, skipping batch commit.");
      }

      if (
        redisMysteryViewCountKeys.length > 0 ||
        redisCategoryViewCountKeys.length > 0 ||
        redisKeyRecentViews.length > 0
      ) {
        await redis.del(
          ...redisMysteryViewCountKeys,
          ...redisCategoryViewCountKeys,
          ...redisKeyRecentViews,
        );
      } else {
        logger.info("No keys to delete from redis.");
      }

      logger.info("Redis reset successfully");
      return;
    } catch (error) {
      logger.error("Error in resetRedis function:", error);
      return;
    }
  },
);

export const scheduleTrigger = onTaskDispatched((a) => {
  logger.info("onTaskDispatched", a);
});

// const htmlTemplate = `<!doctypehtml><html xmlns:o=urn:schemas-microsoft-com:office:office xmlns:v=urn:schemas-microsoft-com:vml><meta charset=UTF-8><meta content="text/html; charset=utf-8"http-equiv=Content-Type><meta content="IE=edge"http-equiv=X-UA-Compatible><meta content="width=device-width,initial-scale=1"name=viewport><meta content="telephone=no"name=format-detection><meta content="date=no"name=format-detection><meta content="address=no"name=format-detection><meta content="email=no"name=format-detection><meta name=x-apple-disable-message-reformatting><link href="https://fonts.googleapis.com/css?family=Onest:ital,wght@0,400;0,400;0,600;0,800"rel=stylesheet><link href="https://fonts.googleapis.com/css?family=Mystery+Quest:ital,wght@0,400;0,400"rel=stylesheet><title>Untitled</title><style>body,html{margin:0!important;padding:0!important;min-height:100%!important;width:100%!important;-webkit-font-smoothing:antialiased}*{-ms-text-size-adjust:100%}#outlook a{padding:0}.ExternalClass,.ReadMsgBody{width:100%}.ExternalClass,.ExternalClass div,.ExternalClass font,.ExternalClass p,.ExternalClass span,.ExternalClass td{line-height:100%}table,td,th{mso-table-lspace:0!important;mso-table-rspace:0!important;border-collapse:collapse}u+.body table,u+.body td,u+.body th{will-change:transform}a,body,div,li,p,span,td,th{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;mso-line-height-rule:exactly}img{border:0;outline:0;line-height:100%;text-decoration:none;-ms-interpolation-mode:bicubic}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important}.body .pc-project-body{background-color:transparent!important}@media (min-width:621px){.pc-lg-hide{display:none}.pc-lg-bg-img-hide{background-image:none!important}}</style><style>@media (max-width:620px){.pc-project-body{min-width:0!important}.pc-project-container{width:100%!important}.pc-sm-hide,.pc-w620-gridCollapsed-1>tbody>tr>.pc-sm-hide{display:none!important}.pc-sm-bg-img-hide{background-image:none!important}table.pc-w620-spacing-0-0-40-0{margin:0 0 40px 0!important}td.pc-w620-spacing-0-0-40-0,th.pc-w620-spacing-0-0-40-0{margin:0!important;padding:0 0 40px 0!important}a.pc-w620-align-center,div.pc-w620-align-center,td.pc-w620-align-center,th.pc-w620-align-center{text-align:center!important;text-align-last:center!important}table.pc-w620-align-center{float:none!important;margin-right:auto!important;margin-left:auto!important}img.pc-w620-align-center{margin-right:auto!important;margin-left:auto!important}.pc-w620-font-size-16px{font-size:16px!important}.pc-w620-text-align-center{text-align:center!important;text-align-last:center!important}.pc-w620-line-height-44px{line-height:44px!important}.pc-w620-font-size-40px{font-size:40px!important}.pc-w620-padding-20-20-0-20{padding:20px 20px 0 20px!important}table.pc-w620-spacing-0-0-0-0{margin:0!important}td.pc-w620-spacing-0-0-0-0,th.pc-w620-spacing-0-0-0-0{margin:0!important;padding:0!important}.pc-w620-padding-20-70-20-70{padding:20px 70px 20px 70px!important}.pc-w620-itemsSpacings-0-30{padding-left:0!important;padding-right:0!important;padding-top:15px!important;padding-bottom:15px!important}.pc-w620-valign-top{vertical-align:top!important}td.pc-w620-halign-center,th.pc-w620-halign-center{text-align:center!important}table.pc-w620-halign-center{float:none!important;margin-right:auto!important;margin-left:auto!important}img.pc-w620-halign-center{margin-right:auto!important;margin-left:auto!important}table.pc-w620-spacing-0-0-15-0{margin:0 0 15px 0!important}td.pc-w620-spacing-0-0-15-0,th.pc-w620-spacing-0-0-15-0{margin:0!important;padding:0 0 15px 0!important}table.pc-w620-spacing-0-0-20-0{margin:0 0 20px 0!important}td.pc-w620-spacing-0-0-20-0,th.pc-w620-spacing-0-0-20-0{margin:0!important;padding:0 0 20px 0!important}.pc-w620-padding-12-10-12-10{padding:12px 10px 12px 10px!important}a.pc-w620-textAlign-center,div.pc-w620-textAlign-center,td.pc-w620-textAlign-center,th.pc-w620-textAlign-center{text-align:center!important;text-align-last:center!important}table.pc-w620-textAlign-center{float:none!important;margin-right:auto!important;margin-left:auto!important}img.pc-w620-textAlign-center{margin-right:auto!important;margin-left:auto!important}.pc-w620-font-size-20px{font-size:20px!important}.pc-w620-letter-spacing-1p5px{letter-spacing:1.5px!important}.pc-w620-line-height-32px{line-height:32px!important}.pc-w620-itemsSpacings-0-20{padding-left:0!important;padding-right:0!important;padding-top:10px!important;padding-bottom:10px!important}table.pc-w620-spacing-20-0-20-0{margin:20px 0 20px 0!important}td.pc-w620-spacing-20-0-20-0,th.pc-w620-spacing-20-0-20-0{margin:0!important;padding:20px 0 20px 0!important}.pc-w620-width-160px{width:160px!important}.pc-w620-padding-0-20-0-20{padding:0 20px 0 20px!important}.pc-w620-font-size-18px{font-size:18px!important}.pc-w620-line-height-20px{line-height:20px!important}.pc-w620-padding-0-18-18-18{padding:0 18px 18px 18px!important}table.pc-w620-spacing-0-0-32-0{margin:0 0 32px 0!important}td.pc-w620-spacing-0-0-32-0,th.pc-w620-spacing-0-0-32-0{margin:0!important;padding:0 0 32px 0!important}.pc-w620-width-200px{width:200px!important}.pc-w620-padding-0-0-0-0{padding:0!important}.pc-w620-width-160{width:160px!important}.pc-w620-height-auto{height:auto!important}.pc-w620-itemsSpacings-20-0{padding-left:10px!important;padding-right:10px!important;padding-top:0!important;padding-bottom:0!important}.pc-w620-padding-18-18-18-18{padding:18px 18px 18px 18px!important}.pc-w620-gridCollapsed-1>tbody,.pc-w620-gridCollapsed-1>tbody>tr,.pc-w620-gridCollapsed-1>tr{display:inline-block!important}.pc-w620-gridCollapsed-1.pc-width-fill>tbody,.pc-w620-gridCollapsed-1.pc-width-fill>tbody>tr,.pc-w620-gridCollapsed-1.pc-width-fill>tr{width:100%!important}.pc-w620-gridCollapsed-1.pc-w620-width-fill>tbody,.pc-w620-gridCollapsed-1.pc-w620-width-fill>tbody>tr,.pc-w620-gridCollapsed-1.pc-w620-width-fill>tr{width:100%!important}.pc-w620-gridCollapsed-1>tbody>tr>td,.pc-w620-gridCollapsed-1>tr>td{display:block!important;width:auto!important;padding-left:0!important;padding-right:0!important;margin-left:0!important}.pc-w620-gridCollapsed-1.pc-width-fill>tbody>tr>td,.pc-w620-gridCollapsed-1.pc-width-fill>tr>td{width:100%!important}.pc-w620-gridCollapsed-1.pc-w620-width-fill>tbody>tr>td,.pc-w620-gridCollapsed-1.pc-w620-width-fill>tr>td{width:100%!important}.pc-w620-gridCollapsed-1>tbody>.pc-grid-tr-first>.pc-grid-td-first,pc-w620-gridCollapsed-1>.pc-grid-tr-first>.pc-grid-td-first{padding-top:0!important}.pc-w620-gridCollapsed-1>tbody>.pc-grid-tr-last>.pc-grid-td-last,pc-w620-gridCollapsed-1>.pc-grid-tr-last>.pc-grid-td-last{padding-bottom:0!important}.pc-w620-gridCollapsed-0>.pc-grid-tr-first>td,.pc-w620-gridCollapsed-0>tbody>.pc-grid-tr-first>td{padding-top:0!important}.pc-w620-gridCollapsed-0>.pc-grid-tr-last>td,.pc-w620-gridCollapsed-0>tbody>.pc-grid-tr-last>td{padding-bottom:0!important}.pc-w620-gridCollapsed-0>tbody>tr>.pc-grid-td-first,.pc-w620-gridCollapsed-0>tr>.pc-grid-td-first{padding-left:0!important}.pc-w620-gridCollapsed-0>tbody>tr>.pc-grid-td-last,.pc-w620-gridCollapsed-0>tr>.pc-grid-td-last{padding-right:0!important}.pc-w620-tableCollapsed-1>tbody,.pc-w620-tableCollapsed-1>tbody>tr,.pc-w620-tableCollapsed-1>tr{display:block!important}.pc-w620-tableCollapsed-1.pc-width-fill>tbody,.pc-w620-tableCollapsed-1.pc-width-fill>tbody>tr,.pc-w620-tableCollapsed-1.pc-width-fill>tr{width:100%!important}.pc-w620-tableCollapsed-1.pc-w620-width-fill>tbody,.pc-w620-tableCollapsed-1.pc-w620-width-fill>tbody>tr,.pc-w620-tableCollapsed-1.pc-w620-width-fill>tr{width:100%!important}.pc-w620-tableCollapsed-1>tbody>tr>td,.pc-w620-tableCollapsed-1>tr>td{display:block!important;width:auto!important}.pc-w620-tableCollapsed-1.pc-width-fill>tbody>tr>td,.pc-w620-tableCollapsed-1.pc-width-fill>tr>td{width:100%!important;box-sizing:border-box!important}.pc-w620-tableCollapsed-1.pc-w620-width-fill>tbody>tr>td,.pc-w620-tableCollapsed-1.pc-w620-width-fill>tr>td{width:100%!important;box-sizing:border-box!important}}</style><style>@font-face{font-family:Onest;font-style:normal;font-weight:800;src:url(https://fonts.gstatic.com/s/onest/v6/gNMZW3F-SZuj7zOT0IfSjTS16cPhdRipuxtL.woff) format('woff'),url(https://fonts.gstatic.com/s/onest/v6/gNMZW3F-SZuj7zOT0IfSjTS16cPhdRipuxtN.woff2) format('woff2')}@font-face{font-family:Onest;font-style:normal;font-weight:600;src:url(https://fonts.gstatic.com/s/onest/v6/gNMZW3F-SZuj7zOT0IfSjTS16cPhKxipuxtL.woff) format('woff'),url(https://fonts.gstatic.com/s/onest/v6/gNMZW3F-SZuj7zOT0IfSjTS16cPhKxipuxtN.woff2) format('woff2')}@font-face{font-family:Onest;font-style:normal;font-weight:400;src:url(https://fonts.gstatic.com/s/onest/v6/gNMZW3F-SZuj7zOT0IfSjTS16cPh9R-puxtL.woff) format('woff'),url(https://fonts.gstatic.com/s/onest/v6/gNMZW3F-SZuj7zOT0IfSjTS16cPh9R-puxtN.woff2) format('woff2')}@font-face{font-family:'Mystery Quest';font-style:normal;font-weight:400;src:url(https://fonts.gstatic.com/s/mysteryquest/v20/-nF6OG414u0E6k0wynSGlujRLwgvCA.woff) format('woff'),url(https://fonts.gstatic.com/s/mysteryquest/v20/-nF6OG414u0E6k0wynSGlujRLwgvDg.woff2) format('woff2')}</style><!--<![endif]--><!--[if mso]><style>.pc-font-alt{font-family:Arial,Helvetica,sans-serif!important}</style><![endif]--><!--[if gte mso 9]><xml><o:officedocumentsettings><o:allowpng><o:pixelsperinch>96</o:pixelsperinch></o:officedocumentsettings></xml><![endif]--><body bgcolor=#eeecff class="pc-font-alt body"style=width:100%!important;min-height:100%!important;margin:0!important;padding:0!important;line-height:1.5;color:#2d3a41;mso-line-height-rule:exactly;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;font-variant-ligatures:normal;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;background-color:#eeecff><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100% style=table-layout:fixed;min-width:600px;background-color:#eeecff class=pc-project-body bgcolor=#eeecff><tr><td valign=top align=center><table border=0 cellpadding=0 cellspacing=0 role=presentation width=600 style=width:600px;max-width:600px class=pc-project-container align=center><tr><td valign=top align=left style="padding:20px 0 10px 0"><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100% style=width:100%><tr><td valign=top><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100%><tr><td class=pc-w620-spacing-0-0-0-0 style=padding:0><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100%><tr><!--[if !gte mso 9]><!-- --><td valign=top class=pc-w620-padding-20-70-20-70 style="background-image:url(https://cloudfilesdm.com/postcards/image-1738404600196.png);background-size:cover;background-position:bottom center;background-repeat:no-repeat;padding:20px 30px 40px 30px;height:unset;border-radius:0;background-color:#120e2a;box-shadow:0 2px 4px 0 rgba(0,0,0,.1)"bgcolor=#120e2a background=https://cloudfilesdm.com/postcards/image-1738404600196.png><!--<![endif]--><!--[if gte mso 9]><td valign=top align=center style="background-image:url(https://cloudfilesdm.com/postcards/image-1738404600196.png);background-size:cover;background-position:bottom center;background-repeat:no-repeat;background-color:#120e2a;border-radius:0;box-shadow:0 2px 4px 0 rgba(0,0,0,.1)"bgcolor=#120e2a background=https://cloudfilesdm.com/postcards/image-1738404600196.png><![endif]--><!--[if gte mso 9]><v:rect xmlns:v=urn:schemas-microsoft-com:vml fill=true stroke=false style=width:600px><v:fill src=https://cloudfilesdm.com/postcards/image-1738404600196.png color=#120e2a type=frame size=1,1 aspect=atleast origin=-0.5,0.5 position=-0.5,0.5><v:textbox style=mso-fit-shape-to-text:true inset=0,0,0,0><div style=font-size:0;line-height:0><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100%><tr><td valign=top style=font-size:14px;line-height:1.5><p style=margin:0;mso-hide:all><o:p xmlns:o=urn:schemas-microsoft-com:office:office></o:p><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100%><tr><td colspan=3 height=20 style=line-height:1px;font-size:1px><tr><td valign=top width=30 style=line-height:1px;font-size:1px><td valign=top align=left><![endif]--><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100%><tr><td valign=top align=center><img alt=""height=auto src=https://cloudfilesdm.com/postcards/image-1738405963673.png style=display:block;outline:0;line-height:100%;-ms-interpolation-mode:bicubic;width:30%;height:auto;border:0 width=162></table><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100%><tr><td valign=top align=left style=padding:0><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100% style=border-collapse:separate;border-spacing:0;margin-right:auto;margin-left:auto><tr><td valign=top align=left style="padding:20px 0 0 0"><div class=pc-font-alt style=text-decoration:none><div style=font-size:40px;line-height:44px;text-align:center;text-align-last:center;font-weight:400;font-style:normal;color:#fff;letter-spacing:0;font-variant-ligatures:normal><div class=pc-w620-text-align-center><span style="font-family:'Mystery Quest',Arial,Helvetica,sans-serif;line-height:68px;font-size:64px;text-transform:uppercase"class="pc-w620-font-size-40px pc-w620-line-height-44px">Mysteryverse is now in a new realm</span></div></div></div></table></table><!--[if gte mso 9]><td valign=top width=30 style=line-height:1px;font-size:1px></td><tr><td colspan=3 height=40 style=line-height:1px;font-size:1px></tr><p style=margin:0;mso-hide:all><o:p xmlns:o=urn:schemas-microsoft-com:office:office></o:p><![endif]--></table></table><tr><td valign=top><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100%><tr><td class=pc-w620-spacing-0-0-0-0 style=padding:0><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100%><tr><td valign=top class=pc-w620-padding-0-18-18-18 style="padding:0 32px 32px 32px;height:unset;border-radius:0;background-color:#120e2a"bgcolor=#120e2a><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100%><tr><td><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100% class="pc-w620-gridCollapsed-1 pc-width-fill"><tr class="pc-grid-tr-first pc-grid-tr-last"><td valign=top align=left class="pc-grid-td-first pc-grid-td-last pc-w620-itemsSpacings-0-30"style=padding-top:0;padding-right:0;padding-bottom:0;padding-left:0><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100% style=border-collapse:separate;border-spacing:0;width:100%><tr><td valign=middle align=left class="pc-w620-halign-center pc-w620-valign-top pc-w620-padding-20-20-0-20"style="padding:30px 30px 0 30px;background-color:#fff;border-radius:8px"><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100% style=width:100% class=pc-w620-halign-center align=left><tr><td valign=top align=left class=pc-w620-halign-center><table border=0 cellpadding=0 cellspacing=0 role=presentation class=pc-w620-halign-center align=left><tr><td valign=top class=pc-w620-spacing-0-0-15-0 style="padding:0 0 25px 0"><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100% style=border-collapse:separate;border-spacing:0><tr><td valign=top align=center><div class=pc-font-alt style=text-decoration:none><div style=font-size:16px;line-height:150%;text-align:left;text-align-last:left;font-weight:400;font-style:normal;color:#5d5a66;letter-spacing:0;font-variant-ligatures:normal><div class=pc-w620-text-align-center><span style=font-family:Onest,Arial,Helvetica,sans-serif;line-height:150%;font-size:20px class=pc-w620-font-size-16px>Hello </span><span style=font-family:Onest,Arial,Helvetica,sans-serif;line-height:150%;font-weight:700;font-size:20px class=pc-w620-font-size-16px>Hunter,</span></div><div style=line-height:150%;font-size:20px><br></div><div class=pc-w620-text-align-center><span style=font-family:Onest,Arial,Helvetica,sans-serif;line-height:150%;font-size:20px class=pc-w620-font-size-16px>Thanks for your initial feedbacks. Mysteryverse is going live in its own domain below, and our journey will continue there from now. Got ideas, suggestions or roasts? Toss them my way anytime! New Mysteries and Events awaiting, See you there...</span></div></div></div></table></table><tr><td valign=top align=left class=pc-w620-halign-center><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100% style=width:100%><tr><td valign=top class=pc-w620-spacing-0-0-15-0 style="padding:0 0 25px 0"><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100% style=margin-right:auto class=pc-w620-align-center><tr><td valign=top height=1 style="line-height:1px;font-size:1px;border-bottom:1px solid #eae8f1"></table></table><tr><td valign=top align=left class=pc-w620-halign-center><tr><td valign=top align=left class=pc-w620-halign-center><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100% class=pc-w620-halign-center><tr><td class="pc-w620-halign-center pc-w620-valign-top pc-w620-spacing-0-0-20-0"style="padding:0 0 32px 0"><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100% class="pc-w620-halign-center pc-w620-gridCollapsed-1 pc-width-fill"><tr class="pc-grid-tr-first pc-grid-tr-last"><td valign=top align=left class="pc-grid-td-first pc-grid-td-last pc-w620-itemsSpacings-0-30"style=width:50%;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100% style=border-collapse:separate;border-spacing:0;width:100% class=pc-w620-halign-center><tr><td valign=top align=left class="pc-w620-halign-center pc-w620-valign-top"><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100% style=width:100% class=pc-w620-halign-center align=left><tr><td valign=top align=left class=pc-w620-halign-center><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100%><tr><th align=left class=pc-w620-align-center style=text-align:left;font-weight:400;line-height:1 valign=top><a class="pc-w620-padding-12-10-12-10 pc-w620-textAlign-center"href=https://mysteryverse.co.in/ style="display:inline-block;box-sizing:border-box;border-top:2px solid #120d2d;border-right:2px solid #120d2d;border-bottom:2px solid #120d2d;border-left:2px solid #120d2d;border-radius:100px 100px 100px 100px;background-color:#f5f5f5;padding:20px 24px 20px 24px;width:100%;font-family:'Fira Sans',Arial,Helvetica,sans-serif;vertical-align:top;text-align:center;text-align-last:center;text-decoration:none;-webkit-text-size-adjust:none;mso-hide:all"target=_blank><span style=font-size:20px;line-height:32px;font-weight:800;font-style:normal;letter-spacing:2px;color:#120e2a;display:inline-block;font-variant-ligatures:normal><span style=display:inline-block><span style=font-family:Onest,Arial,Helvetica,sans-serif;line-height:40px;font-size:32px class="pc-w620-font-size-20px pc-w620-letter-spacing-1p5px pc-w620-line-height-32px">mysteryverse.co.in</span></span></span></a></table></table></table></table></table><tr><td valign=top align=left class=pc-w620-halign-center><tr><td valign=top align=left class=pc-w620-halign-center><tr><td valign=top align=left class=pc-w620-halign-center></table></table></table></table></table></table></table></table></table>`;

// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false,
//   // secure: true,
//   auth: {
//     user: "mysteryverse.co@gmail.com",
//     pass: "gjdg qpmw jguh tzcv",
//   },
// });

// exports.checkUpcomingEvents = functions.pubsub.schedule("every 1 minutes").onRun(async (context) => {
//   const now = Date.now();
//   const tenMinutesLater = now + 10 * 60 * 1000; // 10 minutes later

//   const eventsRef = admin.firestore().collection("events");
//   const snapshot = await eventsRef
//       .where("ScheduledFrom", ">=", Math.floor(now / 1000)) // Convert to seconds
//       .where("ScheduledFrom", "<=", Math.floor(tenMinutesLater / 1000)) // Convert to seconds
//       .get();

//   if (snapshot.empty) {
//       console.log("No upcoming events.");
//       return null;
//   }

//   const emailPromises = [];

//   snapshot.forEach((doc) => {
//       const event = doc.data();
// const email = event.userEmail; // Assuming each event has a registered user's email
export const trySomething = onSchedule("0 8-20/1 * * *", async () => {
  // const hunters = await firestore.collection("hunters").select("email").where("disabled", "==", false).where("emailVerified", "==", true).get();
  // const hunterEmails = hunters.docs.map((hunter) => hunter.data().email || null).filter((mail) => mail !== null);
  // const mailOptions = {
  //   from: "Mysteryverse <mysteryverse.co@gmail.com>",
  //   to: "gkrish16.a@gmail.com",
  //   subject: `Mysteryverse's New Portal`,
  //   bcc: ["www.bhalajiinbasekaran@gmail.com", "dinakaranvikatan@gmail.com"],
  //   // text: `Hello, your event SHHHH starts in 10 minutes`,
  //   html: htmlTemplate,
  // };

  // transporter.sendMail(mailOptions);

  // firestore.collection("mail").add({
  //   to: "me <mysteryverse.co@gmail.com>",
  //   bcc: hunterEmails,
  //   message: {
  //     subject: "Mysteryverse Going Live",
  //     html: htmlTemplate,
  //   },
  // });
  // await adminFunctions.taskQueue("scheduleTrigger").enqueue({test: "Test Data"}, {
  //   scheduleTime: new Date(Date.now() + 2 * 60 * 1000),
  // });

  // console.log("MAIL SENT SUCCESSFULLY!", hunterEmails.length);
  console.log("MAIL SENT SUCCESSFULLY!");
});

// emailPromises.push(transporter.sendMail(mailOptions));
//   });

//   return Promise.all(emailPromises);
// });
